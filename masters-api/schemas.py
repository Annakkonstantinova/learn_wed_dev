from pydantic import BaseModel, ConfigDict


class MasterResponse(BaseModel):
    id: int
    name: str
    specialization: str

    model_config = ConfigDict(from_attributes=True)
