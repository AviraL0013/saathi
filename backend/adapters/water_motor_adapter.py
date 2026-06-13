from datetime import datetime, timezone
from typing import Any

from schemas import NormalizedEvent
from schemas.enums import DeviceType, EventType, ImpactLevel
from adapters.base_adapter import BaseAdapter


class WaterMotorAdapter(BaseAdapter):
    """
    Maps raw water motor payloads to NormalizedEvent.
    Expected payload keys: state, tank_level_percent, flow_rate_lpm, timestamp
    """

    device_type = DeviceType.WATER_MOTOR

    def normalize(
        self,
        raw_payload: dict[str, Any],
        household_id: str,
        device_id: str,
        room_id: str | None = None,
        affected_member_ids: list[str] | None = None,
    ) -> NormalizedEvent:
        tank = raw_payload.get("tank_level_percent", 0)
        state = raw_payload.get("state", "unknown")

        # Determine impact level
        if tank >= 95:
            sub_key = "overflow" if tank >= 100 else "tank_full"
        else:
            sub_key = "default"
        impact = self._get_impact_level(self.device_type, sub_key)

        # Requires Bedrock if something unusual (not a simple fill cycle)
        requires_ai = False

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
                "tank_level_percent": tank,
                "flow_rate_lpm": raw_payload.get("flow_rate_lpm", 0),
            },
            impact_level=impact,
            dedup_key=dedup_key,
            adapter_id="water_motor_adapter_v1",
            affected_member_ids=affected_member_ids or [],
            requires_ai=requires_ai,
            source_raw=raw_payload,
        )
