from typing import Any

from schemas import NormalizedEvent
from schemas.enums import DeviceType, EventType, ImpactLevel
from adapters.base_adapter import BaseAdapter


class GeyserAdapter(BaseAdapter):
    """
    Maps raw geyser payloads to NormalizedEvent.
    Expected payload keys: state, running_minutes, temperature_c, timestamp
    """

    device_type = DeviceType.GEYSER

    def normalize(
        self,
        raw_payload: dict[str, Any],
        household_id: str,
        device_id: str,
        room_id: str | None = None,
        affected_member_ids: list[str] | None = None,
    ) -> NormalizedEvent:
        running_minutes = raw_payload.get("running_minutes", 0)
        temp = raw_payload.get("temperature_c", 0)
        state = raw_payload.get("state", "unknown")

        if temp > 80:
            sub_key = "overheat"
        elif running_minutes >= 30:
            sub_key = "timeout"
        else:
            sub_key = "default"
        impact = self._get_impact_level(self.device_type, sub_key)

        now = self._now()
        dedup_key = self._compute_dedup_key(household_id, device_id, EventType.DEVICE_STATE, now)

        return NormalizedEvent(
            household_id=household_id,
            event_type=EventType.DEVICE_STATE,
            device_type=self.device_type,
            device_id=device_id,
            room_id=room_id,
            payload={
                "state": state,
                "running_minutes": running_minutes,
                "temperature_c": temp,
            },
            impact_level=impact,
            dedup_key=dedup_key,
            adapter_id="geyser_adapter_v1",
            affected_member_ids=affected_member_ids or [],
            requires_ai=False,
            source_raw=raw_payload,
        )
