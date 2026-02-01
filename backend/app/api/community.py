"""Community endpoints"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.community import Community, ForumQuestion, ForumAnswer
from ..schemas.community_schema import (
    Community as CommunitySchema,
    CommunityCreate,
    ForumQuestion as ForumQuestionSchema,
    ForumQuestionCreate,
    ForumAnswer as ForumAnswerSchema,
    ForumAnswerCreate
)

router = APIRouter()


@router.get("")
def list_communities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all communities"""
    communities = db.query(Community).filter(Community.is_active == True).offset(skip).limit(limit).all()
    return communities


@router.get("/{community_id}", response_model=CommunitySchema)
def get_community(community_id: int, db: Session = Depends(get_db)):
    """Get community by ID"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return community


@router.post("", response_model=CommunitySchema)
def create_community(community: CommunityCreate, db: Session = Depends(get_db)):
    """Create a new community"""
    db_community = Community(**community.dict())
    db.add(db_community)
    db.commit()
    db.refresh(db_community)
    return db_community


# Forum endpoints
@router.get("/{community_id}/questions")
def list_forum_questions(community_id: int, category: str | None = None, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """List forum questions in a community"""
    query = db.query(ForumQuestion).filter(ForumQuestion.community_id == community_id)
    if category:
        query = query.filter(ForumQuestion.category == category)
    questions = query.offset(skip).limit(limit).all()
    return questions


@router.get("/{community_id}/questions/{question_id}", response_model=ForumQuestionSchema)
def get_forum_question(community_id: int, question_id: int, db: Session = Depends(get_db)):
    """Get a specific forum question"""
    question = db.query(ForumQuestion).filter(
        ForumQuestion.id == question_id,
        ForumQuestion.community_id == community_id
    ).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.post("/{community_id}/questions", response_model=ForumQuestionSchema)
def create_forum_question(community_id: int, question: ForumQuestionCreate, db: Session = Depends(get_db)):
    """Create a new forum question"""
    db_question = ForumQuestion(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


@router.post("/{community_id}/questions/{question_id}/answers", response_model=ForumAnswerSchema)
def create_forum_answer(community_id: int, question_id: int, answer: ForumAnswerCreate, db: Session = Depends(get_db)):
    """Create an answer to a forum question"""
    # Verify question exists
    question = db.query(ForumQuestion).filter(ForumQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    db_answer = ForumAnswer(**answer.dict())
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer


@router.get("/{community_id}/questions/{question_id}/answers")
def list_answers(community_id: int, question_id: int, db: Session = Depends(get_db)):
    """List answers for a question"""
    answers = db.query(ForumAnswer).filter(ForumAnswer.question_id == question_id).all()
    return answers
