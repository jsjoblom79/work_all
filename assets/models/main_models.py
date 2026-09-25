from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass

class Processes(Base):
    __tablename__ = 'processes'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)


class DialerFormat(Base):
    __tablename__ = 'dialer_formats'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    header: Mapped[str] = mapped_column(String)

    def header_array(self):
        return self.header.split(',')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'header': self.header_array(),
        }