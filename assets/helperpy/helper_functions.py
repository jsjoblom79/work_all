from datetime import datetime


def parse_datetime(datetime_str) -> datetime | None:
    if datetime_str is None or datetime_str == "":
        return None
    if isinstance(datetime_str, datetime):
        return datetime_str
    try:
        return datetime.fromisoformat(str(datetime_str).replace("Z", "+00:00"))
    except Exception as e:
        raise ValueError(f"Could not parse datetime: {datetime_str!r}")