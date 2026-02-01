"""Pydantic schemas for request/response validation"""

from .user_schema import User, UserCreate, UserLogin, UserUpdate, Token
from .subscription_schema import Subscription, SubscriptionCreate, SubscriptionUpdate, SubscriptionPlan
from .community_schema import Community, CommunityCreate, ForumQuestion, ForumQuestionCreate, ForumAnswer, ForumAnswerCreate
from .feature_request_schema import FeatureRequestCreate, FeatureRequestUpdate, FeatureRequestResponse, AIPromptCreate, AIPromptResponse
from .opportunity_schema import OpportunityCreate, OpportunityResponse, UserIssueCreate, UserIssueUpdate, UserIssueResponse
from .theme_schema import ThemeCreate, ThemeResponse, UserPreferenceCreate, UserPreferenceUpdate, UserPreferenceResponse
from .campaign_schema import MarketingCampaignCreate, MarketingCampaignUpdate, MarketingCampaignResponse
from .service_schema import (
    PlatformServiceCreate,
    PlatformServiceUpdate,
    PlatformServiceResponse,
    ExternalIntegrationCreate,
    ExternalIntegrationUpdate,
    ExternalIntegrationResponse,
    ServiceExchangeCreate,
    ServiceExchangeResponse,
)
from .impersonation_schema import ImpersonationCreate, ImpersonationResponse

__all__ = [
    "User",
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "Token",
    "Subscription",
    "SubscriptionCreate",
    "SubscriptionUpdate",
    "SubscriptionPlan",
    "Community",
    "CommunityCreate",
    "ForumQuestion",
    "ForumQuestionCreate",
    "ForumAnswer",
    "ForumAnswerCreate",
    "FeatureRequestCreate",
    "FeatureRequestUpdate",
    "FeatureRequestResponse",
    "AIPromptCreate",
    "AIPromptResponse",
    "OpportunityCreate",
    "OpportunityResponse",
    "UserIssueCreate",
    "UserIssueUpdate",
    "UserIssueResponse",
    "ThemeCreate",
    "ThemeResponse",
    "UserPreferenceCreate",
    "UserPreferenceUpdate",
    "UserPreferenceResponse",
    "MarketingCampaignCreate",
    "MarketingCampaignUpdate",
    "MarketingCampaignResponse",
    "PlatformServiceCreate",
    "PlatformServiceUpdate",
    "PlatformServiceResponse",
    "ExternalIntegrationCreate",
    "ExternalIntegrationUpdate",
    "ExternalIntegrationResponse",
    "ServiceExchangeCreate",
    "ServiceExchangeResponse",
    "ImpersonationCreate",
    "ImpersonationResponse",
]
