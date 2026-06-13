from typing import Any

from schemas import NormalizedEvent
from schemas.enums import DeviceType, EventType, ImpactLevel
from adapters.base_adapter import BaseAdapter


class PressureCookerAdapter(BaseAdapter):
    """
    Maps raw pressure cooker payloads to NormalizedEvent.
    Expected payload keys: state, whistle_count, temperature_c, pressure_kpa
    """

    device_type = DeviceType.PRESSURE_COOKER

    def normalize(
        self,
        raw_payload: dict[str, Any],
        household_id: str,
        device_id: str,
        room_id: str | None = None,
        affected_member_ids: list[str] | None = None,
    ) -> NormalizedEvent:
        whistles = raw_payload.get("whistle_count", 0)
        state = raw_payload.get("state", "unknown")
        pressure_kpa = raw_payload.get("pressure_kpa", 0)

        if state == "no_response" or pressure_kpa > 200:
            sub_key = "no_response"
        elif whistles >= 5:
            sub_key = "whistle_5"
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
                "whistle_count": whistles,
                "temperature_c": raw_payload.get("temperature_c", 0),
                "pressure_kpa": pressure_kpa,
            },
            impact_level=impact,
            dedup_key=dedup_key,
            adapter_id="pressure_cooker_adapter_v1",
            affected_member_ids=affected_member_ids or [],
            requires_ai=False,
            source_raw=raw_payload,
        )
