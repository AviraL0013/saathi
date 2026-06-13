from typing import Any

from schemas import NormalizedEvent
from schemas.enums import DeviceType, EventType, ImpactLevel
from adapters.base_adapter import BaseAdapter


class SmartFridgeAdapter(BaseAdapter):
    """
    Maps raw smart fridge payloads to NormalizedEvent.
    Expected payload keys: state, door_open_seconds, temperature_c, item_category
    """

    device_type = DeviceType.SMART_FRIDGE

    def normalize(
        self,
        raw_payload: dict[str, Any],
        household_id: str,
        device_id: str,
        room_id: str | None = None,
        affected_member_ids: list[str] | None = None,
    ) -> NormalizedEvent:
        door_open_secs = raw_payload.get("door_open_seconds", 0)
        temp = raw_payload.get("temperature_c", 4.0)
        state = raw_payload.get("state", "closed")

        if temp > 10:
            sub_key = "temp_high"
        elif door_open_secs >= 180 or state == "door_open":
            sub_key = "door_open"
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
                "door_open_seconds": door_open_secs,
                "temperature_c": temp,
                "item_category": raw_payload.get("item_category"),
            },
            impact_level=impact,
            dedup_key=dedup_key,
            adapter_id="smart_fridge_adapter_v1",
            affected_member_ids=affected_member_ids or [],
            requires_ai=False,
            source_raw=raw_payload,
        )
