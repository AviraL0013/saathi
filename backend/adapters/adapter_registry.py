"""
adapters/adapter_registry.py
Maps DeviceType to its adapter class.
All new adapters must be registered here.
"""

from schemas.enums import DeviceType
from adapters.base_adapter import BaseAdapter
from adapters.water_motor_adapter import WaterMotorAdapter
from adapters.geyser_adapter import GeyserAdapter
from adapters.pressure_cooker_adapter import PressureCookerAdapter
from adapters.television_adapter import TelevisionAdapter
from adapters.smart_fridge_adapter import SmartFridgeAdapter

# Instantiate once — adapters are stateless
_REGISTRY: dict[DeviceType, BaseAdapter] = {
    DeviceType.WATER_MOTOR:      WaterMotorAdapter(),
    DeviceType.GEYSER:           GeyserAdapter(),
    DeviceType.PRESSURE_COOKER:  PressureCookerAdapter(),
    DeviceType.TELEVISION:       TelevisionAdapter(),
    DeviceType.SMART_FRIDGE:     SmartFridgeAdapter(),
}


def get_adapter(device_type: DeviceType | str) -> BaseAdapter | None:
    """
    Return the adapter for a given device type.
    Returns None if no adapter is registered (caller decides whether to skip or raise).
    """
    if isinstance(device_type, str):
        try:
            device_type = DeviceType(device_type)
        except ValueError:
            return None
    return _REGISTRY.get(device_type)


def registered_types() -> list[DeviceType]:
    return list(_REGISTRY.keys())
