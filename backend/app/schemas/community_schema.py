"""Community schemas"""

from pydantic import BaseModel
from datetime import datetime


class CommunityBase(BaseModel):
    name: str
    description: str | None = None


class CommunityCreate(CommunityBase):
    admin_id: int


class Community(CommunityBase):
    id: int
    admin_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ForumQuestionBase(BaseModel):
    category: str
    title: str
    content: str


class ForumQuestionCreate(ForumQuestionBase):
    community_id: int
    user_id: int


class ForumQuestion(ForumQuestionBase):
    id: int
    community_id: int
    user_id: int
    likes: int
    dislikes: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ForumAnswerBase(BaseModel):
    content: str


class ForumAnswerCreate(ForumAnswerBase):
    question_id: int
    user_id: int


class ForumAnswer(ForumAnswerBase):
    id: int
    question_id: int
    user_id: int
    is_best_answer: bool
    likes: int
    dislikes: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
