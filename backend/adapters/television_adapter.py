from typing import Any

from schemas import NormalizedEvent
from schemas.enums import DeviceType, EventType, ImpactLevel
from adapters.base_adapter import BaseAdapter


class TelevisionAdapter(BaseAdapter):
    """
    Maps raw TV payloads to NormalizedEvent.
    Expected payload keys: status, volume_percent, channel, room_id
    """

    device_type = DeviceType.TELEVISION

    def normalize(
        self,
        raw_payload: dict[str, Any],
        household_id: str,
        device_id: str,
        room_id: str | None = None,
        affected_member_ids: list[str] | None = None,
    ) -> NormalizedEvent:
        volume = raw_payload.get("volume_percent", 0)
        state = raw_payload.get("state", raw_payload.get("status", "unknown"))

        # High volume during quiet/study hours is notable
        sub_key = "loud" if volume >= 50 else "default"
        impact = self._get_impact_level(self.device_type, sub_key)

        now = self._now()
        dedup_key = self._compute_dedup_key(household_id, device_id, EventType.DEVICE_STATE, now)

        return NormalizedEvent(
            household_id=household_id,
            event_type=EventType.DEVICE_STATE,
            device_type=self.device_type,
            device_id=device_id,
            room_id=room_id or raw_payload.get("room_id"),
            payload={
                "state": state,
                "volume_percent": volume,
                "channel": raw_payload.get("channel"),
            },
            impact_level=impact,
            dedup_key=dedup_key,
            adapter_id="television_adapter_v1",
            affected_member_ids=affected_member_ids or [],
            requires_ai=False,
            source_raw=raw_payload,
        )
