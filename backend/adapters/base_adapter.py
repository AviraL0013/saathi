"""
adapters/base_adapter.py
Abstract base class for all device adapters.
Each adapter maps a raw device payload to a NormalizedEvent.
"""

import hashlib
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any

from schemas import NormalizedEvent
from schemas.enums import DeviceType, EventType, ImpactLevel


# Static impact level table — avoids repeated conditionals across adapters
_IMPACT_TABLE: dict[DeviceType, dict[str, ImpactLevel]] = {
    DeviceType.WATER_MOTOR: {
        "default":    ImpactLevel.LOW,
        "tank_full":  ImpactLevel.HIGH,
        "overflow":   ImpactLevel.CRITICAL,
    },
    DeviceType.GEYSER: {
        "default":    ImpactLevel.LOW,
        "timeout":    ImpactLevel.HIGH,
        "overheat":   ImpactLevel.CRITICAL,
    },
    DeviceType.PRESSURE_COOKER: {
        "default":    ImpactLevel.LOW,
        "whistle_5":  ImpactLevel.HIGH,
        "no_response": ImpactLevel.CRITICAL,
    },
    DeviceType.TELEVISION: {
        "default":    ImpactLevel.INFO,
        "loud":       ImpactLevel.LOW,
    },
    DeviceType.SMART_FRIDGE: {
        "default":    ImpactLevel.INFO,
        "door_open":  ImpactLevel.LOW,
        "temp_high":  ImpactLevel.HIGH,
    },
    DeviceType.AC: {
        "default":    ImpactLevel.INFO,
    },
    DeviceType.LIGHT: {
        "default":    ImpactLevel.INFO,
    },
}


class BaseAdapter(ABC):
    """
    Base class for all device adapters.
    Subclasses implement `normalize()` to produce a `NormalizedEvent`.
    `_compute_dedup_key()` and `_get_impact_level()` are shared utilities.
    """

    device_type: DeviceType  # Set on each subclass

    @abstractmethod
    def normalize(
        self,
        raw_payload: dict[str, Any],
        household_id: str,
        device_id: str,
        room_id: str | None = None,
        affected_member_ids: list[str] | None = None,
    ) -> NormalizedEvent:
        """Map a raw device payload to a NormalizedEvent."""
        ...

    def _compute_dedup_key(
        self,
        household_id: str,
        device_id: str,
        event_type: EventType,
        timestamp: datetime,
    ) -> str:
        """
        Dedup key format: <hh_id>:<dev_id>:<event_type>:<minute_bucket>
        Events within the same minute window are considered duplicates.
        """
        minute_bucket = timestamp.strftime("%Y%m%dT%H%M")
        raw = f"{household_id}:{device_id}:{event_type.value}:{minute_bucket}"
        return hashlib.md5(raw.encode()).hexdigest()[:16]

    def _get_impact_level(
        self,
        device_type: DeviceType,
        sub_key: str = "default",
    ) -> ImpactLevel:
        """Lookup impact level from the static table. Falls back to MEDIUM."""
        device_table = _IMPACT_TABLE.get(device_type, {})
        return device_table.get(sub_key, ImpactLevel.MEDIUM)

    def _now(self) -> datetime:
        return datetime.now(timezone.utc)
