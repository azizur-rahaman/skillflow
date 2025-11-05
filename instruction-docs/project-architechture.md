src/
├── core/                                    # Shared kernel & domain primitives
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── base/
│   │   │   │   ├── AggregateRoot.ts
│   │   │   │   ├── Entity.ts
│   │   │   │   └── ValueObject.ts
│   │   │   └── shared/
│   │   │       └── Auditable.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── Result.ts                   # Monad for error handling
│   │   │   ├── Either.ts
│   │   │   ├── Option.ts
│   │   │   └── ValidationError.ts
│   │   │
│   │   ├── events/
│   │   │   ├── IDomainEvent.ts
│   │   │   ├── DomainEventBus.ts
│   │   │   └── EventStore.ts
│   │   │
│   │   └── specifications/
│   │       └── ISpecification.ts
│   │
│   ├── application/
│   │   ├── contracts/
│   │   │   ├── IUseCase.ts
│   │   │   ├── ICommand.ts
│   │   │   ├── ICommandHandler.ts
│   │   │   ├── IQuery.ts
│   │   │   └── IQueryHandler.ts
│   │   │
│   │   ├── ports/
│   │   │   ├── IUnitOfWork.ts
│   │   │   ├── IEventBus.ts
│   │   │   ├── ICache.ts
│   │   │   ├── ILogger.ts
│   │   │   └── IEmailService.ts
│   │   │
│   │   └── dtos/
│   │       └── BaseDTO.ts
│   │
│   ├── infrastructure/
│   │   ├── types/
│   │   │   ├── api.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── ml.types.ts
│   │   │
│   │   ├── errors/
│   │   │   ├── DomainError.ts
│   │   │   ├── ApplicationError.ts
│   │   │   ├── InfrastructureError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   ├── ValidationError.ts
│   │   │   └── ConflictError.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── validators/
│   │   │   ├── formatters/
│   │   │   ├── crypto/
│   │   │   └── parsers/
│   │   │
│   │   └── config/
│   │       ├── app.config.ts
│   │       ├── env.config.ts
│   │       ├── ai-model.config.ts
│   │       └── blockchain.config.ts
│   │
│   └── di/
│       ├── Container.ts
│       ├── ServiceLifetime.ts
│       └── providers/
│           ├── RepositoryProvider.ts
│           ├── AIServiceProvider.ts
│           └── BlockchainProvider.ts
│
├── features/                                # Vertical slice architecture
│   │
│   ├── auth/                                # Authentication & Authorization
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── User.entity.ts          # Aggregate root
│   │   │   │   ├── Session.entity.ts
│   │   │   │   └── RefreshToken.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Email.vo.ts
│   │   │   │   ├── Password.vo.ts
│   │   │   │   ├── UserId.vo.ts
│   │   │   │   ├── UserType.vo.ts          # individual | enterprise | university
│   │   │   │   └── Role.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── UserRegistered.event.ts
│   │   │   │   ├── UserLoggedIn.event.ts
│   │   │   │   ├── PasswordChanged.event.ts
│   │   │   │   └── AccountDeactivated.event.ts
│   │   │   ├── repositories/
│   │   │   │   ├── IUserRepository.ts
│   │   │   │   └── ISessionRepository.ts
│   │   │   ├── services/
│   │   │   │   ├── AuthDomainService.ts
│   │   │   │   └── PasswordHashingService.ts
│   │   │   └── specifications/
│   │   │       ├── UserCanLogin.spec.ts
│   │   │       └── PasswordStrength.spec.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── register/
│   │   │   │   │   ├── RegisterCommand.ts
│   │   │   │   │   ├── RegisterCommandHandler.ts
│   │   │   │   │   └── RegisterCommandValidator.ts
│   │   │   │   ├── login/
│   │   │   │   │   ├── LoginCommand.ts
│   │   │   │   │   └── LoginCommandHandler.ts
│   │   │   │   ├── logout/
│   │   │   │   ├── change-password/
│   │   │   │   └── verify-email/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-current-user/
│   │   │   │   │   ├── GetCurrentUserQuery.ts
│   │   │   │   │   └── GetCurrentUserQueryHandler.ts
│   │   │   │   └── get-user-sessions/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   ├── UserDTO.ts
│   │   │   │   ├── AuthResponseDTO.ts
│   │   │   │   └── SessionDTO.ts
│   │   │   │
│   │   │   └── mappers/
│   │   │       ├── UserMapper.ts
│   │   │       └── SessionMapper.ts
│   │   │
│   │   ├── data/
│   │   │   ├── repositories/
│   │   │   │   ├── PrismaUserRepository.ts
│   │   │   │   └── PrismaSessionRepository.ts
│   │   │   └── read-repositories/
│   │   │       └── UserReadRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   ├── RegisterForm.tsx
│   │       │   ├── SocialConnectors.tsx
│   │       │   └── UserTypeSelector.tsx
│   │       ├── hooks/
│   │       │   ├── useAuth.ts
│   │       │   └── useSession.ts
│   │       ├── stores/
│   │       │   └── authStore.ts
│   │       ├── api/
│   │       │   ├── auth.api.ts
│   │       │   └── session.api.ts
│   │       └── validators/
│   │           ├── loginSchema.ts
│   │           └── registerSchema.ts
│   │
│   ├── connectors/                          # Data source integration
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Connector.entity.ts
│   │   │   │   └── DataSync.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ConnectorType.vo.ts     # linkedin | github | upwork
│   │   │   │   ├── OAuthToken.vo.ts
│   │   │   │   └── SyncStatus.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── ConnectorLinked.event.ts
│   │   │   │   └── DataSynced.event.ts
│   │   │   └── repositories/
│   │   │       └── IConnectorRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── link-connector/
│   │   │   │   ├── sync-data/
│   │   │   │   └── revoke-connector/
│   │   │   ├── queries/
│   │   │   │   ├── get-connectors/
│   │   │   │   └── get-sync-status/
│   │   │   ├── dtos/
│   │   │   │   └── ConnectorDTO.ts
│   │   │   └── services/
│   │   │       ├── LinkedInSyncService.ts
│   │   │       ├── GitHubSyncService.ts
│   │   │       └── UpworkSyncService.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaConnectorRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── ConnectorList.tsx
│   │       │   ├── OAuthConsentScreen.tsx
│   │       │   └── DataSyncProgress.tsx
│   │       └── hooks/
│   │           └── useConnectors.ts
│   │
│   ├── skills/                              # Skill DNA Engine
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Skill.entity.ts
│   │   │   │   ├── UserSkill.entity.ts     # Aggregate root
│   │   │   │   ├── SkillEvidence.entity.ts
│   │   │   │   └── Endorsement.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── SkillId.vo.ts
│   │   │   │   ├── SkillDNA.vo.ts          # Unique skill fingerprint
│   │   │   │   ├── SkillStrength.vo.ts     # 0-100 normalized
│   │   │   │   ├── ObsolescenceRisk.vo.ts
│   │   │   │   └── SkillDomain.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── SkillAcquired.event.ts
│   │   │   │   ├── SkillStrengthUpdated.event.ts
│   │   │   │   ├── SkillEndorsed.event.ts
│   │   │   │   └── ObsolescenceDetected.event.ts
│   │   │   ├── repositories/
│   │   │   │   ├── ISkillRepository.ts
│   │   │   │   ├── IUserSkillRepository.ts
│   │   │   │   └── ISkillGraphRepository.ts
│   │   │   ├── services/
│   │   │   │   ├── SkillExtractionService.ts
│   │   │   │   ├── SkillDNAGenerator.ts
│   │   │   │   └── SkillAffinityMapper.ts
│   │   │   └── specifications/
│   │   │       └── SkillIsObsolete.spec.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── extract-skills/
│   │   │   │   │   ├── ExtractSkillsCommand.ts
│   │   │   │   │   └── ExtractSkillsCommandHandler.ts
│   │   │   │   ├── add-skill-evidence/
│   │   │   │   ├── update-skill-strength/
│   │   │   │   └── endorse-skill/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-user-skills/
│   │   │   │   ├── get-skill-dna/
│   │   │   │   ├── get-skill-graph/
│   │   │   │   └── get-obsolescence-risks/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   ├── SkillDTO.ts
│   │   │   │   ├── UserSkillDTO.ts
│   │   │   │   ├── SkillDNADTO.ts
│   │   │   │   └── SkillGraphDTO.ts
│   │   │   │
│   │   │   ├── mappers/
│   │   │   │   └── SkillMapper.ts
│   │   │   │
│   │   │   └── ai-services/
│   │   │       ├── SkillExtractionAI.ts     # TF-IDF + embeddings
│   │   │       ├── ClusteringService.ts     # Skill affinity
│   │   │       └── SkillNormalization.ts
│   │   │
│   │   ├── data/
│   │   │   ├── repositories/
│   │   │   │   ├── PrismaSkillRepository.ts
│   │   │   │   ├── PrismaUserSkillRepository.ts
│   │   │   │   └── Neo4jSkillGraphRepository.ts
│   │   │   └── read-repositories/
│   │   │       └── SkillReadRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── SkillDNASummary.tsx
│   │       │   ├── SkillGrowthRings.tsx
│   │       │   ├── SkillHeatmap.tsx
│   │       │   ├── SkillGraphExplorer.tsx
│   │       │   ├── SkillDetailPage.tsx
│   │       │   └── ObsolescencePanel.tsx
│   │       ├── hooks/
│   │       │   ├── useSkills.ts
│   │       │   ├── useSkillDNA.ts
│   │       │   └── useSkillGraph.ts
│   │       └── stores/
│   │           └── skillStore.ts
│   │
│   ├── forecasting/                         # Predictive Intelligence Engine
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Forecast.entity.ts
│   │   │   │   ├── ForecastPoint.entity.ts
│   │   │   │   └── EmergingRole.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ForecastHorizon.vo.ts   # 6-18 months
│   │   │   │   ├── ConfidenceScore.vo.ts
│   │   │   │   └── SkillDemandTrend.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── ForecastGenerated.event.ts
│   │   │   │   └── TrendDetected.event.ts
│   │   │   └── repositories/
│   │   │       └── IForecastRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── generate-forecast/
│   │   │   │   │   ├── GenerateForecastCommand.ts
│   │   │   │   │   └── GenerateForecastCommandHandler.ts
│   │   │   │   └── update-forecast/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-skill-forecast/
│   │   │   │   ├── get-trending-skills/
│   │   │   │   ├── get-emerging-roles/
│   │   │   │   └── get-demand-heatmap/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   ├── ForecastDTO.ts
│   │   │   │   ├── TrendingSkillDTO.ts
│   │   │   │   └── EmergingRoleDTO.ts
│   │   │   │
│   │   │   └── ml-services/
│   │   │       ├── ProphetForecastingService.ts
│   │   │       ├── LSTMForecastingService.ts
│   │   │       ├── SemanticRolePrediction.ts   # GPT-based
│   │   │       └── SkillCorrelationEngine.ts
│   │   │
│   │   ├── data/
│   │   │   ├── repositories/
│   │   │   │   └── PrismaForecastRepository.ts
│   │   │   └── data-sources/
│   │   │       ├── LinkedInJobAPI.ts
│   │   │       ├── IndeedScraperService.ts
│   │   │       └── BDJobsAPIService.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── PredictiveDashboard.tsx
│   │       │   ├── ForecastTimeSeries.tsx
│   │       │   ├── TrendingSkillsWidget.tsx
│   │       │   └── EmergingRolesPanel.tsx
│   │       └── hooks/
│   │           └── useForecasting.ts
│   │
│   ├── learning/                            # Adaptive Learning Orchestrator
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── LearningPath.entity.ts  # Aggregate root
│   │   │   │   ├── LearningModule.entity.ts
│   │   │   │   ├── Course.entity.ts
│   │   │   │   └── Assessment.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── PathState.vo.ts         # planned | active | completed
│   │   │   │   ├── MasteryScore.vo.ts
│   │   │   │   └── LearningProgress.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── PathCreated.event.ts
│   │   │   │   ├── ModuleCompleted.event.ts
│   │   │   │   └── AssessmentPassed.event.ts
│   │   │   ├── repositories/
│   │   │   │   ├── ILearningPathRepository.ts
│   │   │   │   └── ICourseRepository.ts
│   │   │   └── services/
│   │   │       └── PathGenerationService.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── generate-learning-path/
│   │   │   │   ├── start-module/
│   │   │   │   ├── complete-module/
│   │   │   │   └── submit-assessment/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-learning-paths/
│   │   │   │   ├── get-recommended-courses/
│   │   │   │   └── get-progress/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   ├── LearningPathDTO.ts
│   │   │   │   ├── ModuleDTO.ts
│   │   │   │   └── ProgressDTO.ts
│   │   │   │
│   │   │   └── recommendation-services/
│   │   │       ├── CollaborativeFilteringEngine.ts
│   │   │       ├── SkillGapAnalyzer.ts
│   │   │       └── CourseRecommender.ts
│   │   │
│   │   ├── data/
│   │   │   ├── repositories/
│   │   │   │   └── PrismaLearningPathRepository.ts
│   │   │   └── integrations/
│   │   │       ├── CourseraAPIClient.ts
│   │   │       └── LinkedInLearningAPIClient.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── LearningPathSummary.tsx
│   │       │   ├── ModuleDetailPage.tsx
│   │       │   ├── CoursePlayer.tsx
│   │       │   ├── SkillChallenge.tsx
│   │       │   └── MasteryScorePanel.tsx
│   │       └── hooks/
│   │           └── useLearningPath.ts
│   │
│   ├── gamification/                        # Engagement & Rewards
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── UserProgress.entity.ts
│   │   │   │   ├── Badge.entity.ts
│   │   │   │   └── Leaderboard.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ExperiencePoints.vo.ts
│   │   │   │   └── Level.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── XPEarned.event.ts
│   │   │   │   ├── BadgeUnlocked.event.ts
│   │   │   │   └── LevelUp.event.ts
│   │   │   └── repositories/
│   │   │       └── IGamificationRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── award-xp/
│   │   │   │   └── unlock-badge/
│   │   │   ├── queries/
│   │   │   │   ├── get-user-progress/
│   │   │   │   └── get-leaderboard/
│   │   │   └── dtos/
│   │   │       └── GamificationDTO.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaGamificationRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── GamificationHub.tsx
│   │       │   └── XPProgressBar.tsx
│   │       └── hooks/
│   │           └── useGamification.ts
│   │
│   ├── tokens/                              # Blockchain Credential Layer
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── SkillToken.entity.ts    # ERC-1155
│   │   │   │   ├── UserWallet.entity.ts
│   │   │   │   └── Transaction.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── TokenId.vo.ts
│   │   │   │   ├── WalletAddress.vo.ts
│   │   │   │   └── TransactionHash.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── TokenMinted.event.ts
│   │   │   │   ├── TokenTransferred.event.ts
│   │   │   │   └── TokenVerified.event.ts
│   │   │   ├── repositories/
│   │   │   │   ├── ITokenRepository.ts
│   │   │   │   └── IWalletRepository.ts
│   │   │   └── services/
│   │   │       └── TokenValidationService.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── mint-token/
│   │   │   │   ├── transfer-token/
│   │   │   │   └── connect-wallet/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-wallet/
│   │   │   │   ├── get-tokens/
│   │   │   │   ├── verify-token/
│   │   │   │   └── get-transactions/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   ├── TokenDTO.ts
│   │   │   │   └── WalletDTO.ts
│   │   │   │
│   │   │   └── blockchain-services/
│   │   │       ├── ERC1155Service.ts
│   │   │       ├── PolygonContractService.ts
│   │   │       └── MetadataService.ts
│   │   │
│   │   ├── data/
│   │   │   ├── repositories/
│   │   │   │   └── PrismaTokenRepository.ts
│   │   │   └── contracts/
│   │   │       ├── SkillToken.sol
│   │   │       └── contract-abi.json
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── TokenWallet.tsx
│   │       │   ├── TokenDetail.tsx
│   │       │   ├── MintingFlow.tsx
│   │       │   ├── WalletConnect.tsx
│   │       │   └── VerificationPage.tsx
│   │       └── hooks/
│   │           ├── useWallet.ts
│   │           └── useTokens.ts
│   │
│   ├── marketplace/                         # Skill Token Marketplace
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Listing.entity.ts
│   │   │   │   └── Purchase.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Price.vo.ts
│   │   │   │   └── ListingStatus.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── ListingCreated.event.ts
│   │   │   │   └── TokenPurchased.event.ts
│   │   │   └── repositories/
│   │   │       └── IMarketplaceRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── create-listing/
│   │   │   │   └── purchase-token/
│   │   │   ├── queries/
│   │   │   │   └── browse-marketplace/
│   │   │   └── dtos/
│   │   │       └── ListingDTO.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaMarketplaceRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── MarketplaceGrid.tsx
│   │       │   └── ListingDetail.tsx
│   │       └── hooks/
│   │           └── useMarketplace.ts
│   │
│   ├── organizations/                       # Enterprise/University Management
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Organization.entity.ts
│   │   │   │   ├── Team.entity.ts
│   │   │   │   └── Member.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── OrganizationId.vo.ts
│   │   │   │   └── MemberRole.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── OrganizationCreated.event.ts
│   │   │   │   └── MemberInvited.event.ts
│   │   │   └── repositories/
│   │   │       └── IOrganizationRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── create-organization/
│   │   │   │   ├── add-member/
│   │   │   │   └── create-team/
│   │   │   ├── queries/
│   │   │   │   ├── get-organization/
│   │   │   │   └── get-team-skills/
│   │   │   └── dtos/
│   │   │       ├── OrganizationDTO.ts
│   │   │       └── TeamDTO.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaOrganizationRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── EnterpriseDashboard.tsx
│   │       │   ├── TeamSkillHeatmap.tsx
│   │       │   └── TalentPoolSearch.tsx
│   │       └── hooks/
│   │           └── useOrganization.ts
│   │
│   ├── analytics/                           # Enterprise Analytics & Reports
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Report.entity.ts
│   │   │   │   └── Heatmap.entity.ts
│   │   │   ├── repositories/
│   │   │   │   └── IAnalyticsRepository.ts
│   │   │   └── services/
│   │   │       └── ReportGenerationService.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands
│   │   │   ├── commands/
│   │   │   │   ├── generate-report/
│   │   │   │   │   ├── GenerateReportCommand.ts
│   │   │   │   │   └── GenerateReportCommandHandler.ts
│   │   │   │   └── create-heatmap/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-kpi-metrics/
│   │   │   │   ├── get-retention-stats/
│   │   │   │   ├── get-skill-gap-analysis/
│   │   │   │   └── export-analytics/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   ├── ReportDTO.ts
│   │   │   │   ├── KPIMetricsDTO.ts
│   │   │   │   └── HeatmapDTO.ts
│   │   │   │
│   │   │   └── services/
│   │   │       ├── DataAggregationService.ts
│   │   │       └── ExportService.ts
│   │   │
│   │   ├── data/
│   │   │   ├── repositories/
│   │   │   │   └── PrismaAnalyticsRepository.ts
│   │   │   └── aggregators/
│   │   │       ├── SkillGapAggregator.ts
│   │   │       └── RetentionAggregator.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── KPIDashboard.tsx
│   │       │   ├── ReportBuilder.tsx
│   │       │   ├── AnalyticsCharts.tsx
│   │       │   └── ExportPanel.tsx
│   │       └── hooks/
│   │           └── useAnalytics.ts
│   │
│   ├── mentorship/                          # Mentor-Mentee System
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── MentorProfile.entity.ts
│   │   │   │   ├── Booking.entity.ts
│   │   │   │   └── LiveSession.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── HourlyRate.vo.ts
│   │   │   │   ├── Rating.vo.ts
│   │   │   │   └── SessionStatus.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── BookingCreated.event.ts
│   │   │   │   ├── SessionStarted.event.ts
│   │   │   │   └── SessionCompleted.event.ts
│   │   │   ├── repositories/
│   │   │   │   ├── IMentorRepository.ts
│   │   │   │   └── IBookingRepository.ts
│   │   │   └── services/
│   │   │       └── MentorMatchingService.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── create-mentor-profile/
│   │   │   │   ├── book-session/
│   │   │   │   ├── start-session/
│   │   │   │   └── rate-mentor/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── browse-mentors/
│   │   │   │   ├── get-mentor-profile/
│   │   │   │   └── get-bookings/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   ├── MentorDTO.ts
│   │   │   │   └── BookingDTO.ts
│   │   │   │
│   │   │   └── services/
│   │   │       ├── TwilioVideoService.ts
│   │   │       └── AgoraVideoService.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaMentorRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── MentorMarketplace.tsx
│   │       │   ├── MentorProfile.tsx
│   │       │   ├── BookingFlow.tsx
│   │       │   └── LiveSessionScreen.tsx
│   │       └── hooks/
│   │           ├── useMentors.ts
│   │           └── useVideoSession.ts
│   │
│   ├── feedback/                            # Feedback & Feature Requests
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Feedback.entity.ts
│   │   │   │   ├── FeatureRequest.entity.ts
│   │   │   │   └── Vote.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── NPSScore.vo.ts
│   │   │   │   └── RequestStatus.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── FeedbackSubmitted.event.ts
│   │   │   │   └── FeatureVoted.event.ts
│   │   │   └── repositories/
│   │   │       └── IFeedbackRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── submit-feedback/
│   │   │   │   ├── create-feature-request/
│   │   │   │   └── vote-feature/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-feedback/
│   │   │   │   └── get-feature-requests/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   └── FeedbackDTO.ts
│   │   │   │
│   │   │   └── services/
│   │   │       └── AutoPrioritizationService.ts  # ML-based ranking
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaFeedbackRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── FeedbackForm.tsx
│   │       │   ├── NPSSurvey.tsx
│   │       │   └── FeatureVotingPanel.tsx
│   │       └── hooks/
│   │           └── useFeedback.ts
│   │
│   ├── notifications/                       # Notification System
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Notification.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── NotificationType.vo.ts
│   │   │   │   └── Channel.vo.ts           # email | inapp | sms
│   │   │   ├── events/
│   │   │   │   └── NotificationSent.event.ts
│   │   │   └── repositories/
│   │   │       └── INotificationRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── send-notification/
│   │   │   │   └── mark-as-read/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   └── get-notifications/
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   └── NotificationDTO.ts
│   │   │   │
│   │   │   └── services/
│   │   │       ├── EmailNotificationService.ts
│   │   │       └── PushNotificationService.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaNotificationRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── NotificationCenter.tsx
│   │       │   └── NotificationBadge.tsx
│   │       └── hooks/
│   │           └── useNotifications.ts
│   │
│   ├── activity/                            # Activity Timeline
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Activity.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   └── ActivityType.vo.ts
│   │   │   └── repositories/
│   │   │       └── IActivityRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   └── log-activity/
│   │   │   ├── queries/
│   │   │   │   └── get-activity-timeline/
│   │   │   └── dtos/
│   │   │       └── ActivityDTO.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaActivityRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   └── ActivityTimeline.tsx
│   │       └── hooks/
│   │           └── useActivity.ts
│   │
│   ├── admin/                               # Admin Console & System Management
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── SystemConfig.entity.ts
│   │   │   │   └── AuditLog.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   └── Permission.vo.ts
│   │   │   ├── events/
│   │   │   │   └── ConfigChanged.event.ts
│   │   │   └── repositories/
│   │   │       ├── IAdminRepository.ts
│   │   │       └── IAuditLogRepository.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── update-config/
│   │   │   │   ├── manage-users/
│   │   │   │   └── revoke-token/
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   ├── get-system-stats/
│   │   │   │   ├── get-audit-logs/
│   │   │   │   └── get-compliance-reports/
│   │   │   │
│   │   │   └── dtos/
│   │   │       └── AdminDTO.ts
│   │   │
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── PrismaAdminRepository.ts
│   │   │
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── AdminConsole.tsx
│   │       │   ├── UserManagement.tsx
│   │       │   ├── RBACSettings.tsx
│   │       │   ├── AuditLogViewer.tsx
│   │       │   └── ComplianceReports.tsx
│   │       └── hooks/
│   │           └── useAdmin.ts
│   │
│   └── integrations/                        # API & External Integrations
│       ├── domain/
│       │   ├── entities/
│       │   │   └── APIKey.entity.ts
│       │   ├── value-objects/
│       │   │   └── APIScope.vo.ts
│       │   └── repositories/
│       │       └── IAPIKeyRepository.ts
│       │
│       ├── application/
│       │   ├── commands/
│       │   │   ├── generate-api-key/
│       │   │   └── revoke-api-key/
│       │   ├── queries/
│       │   │   └── get-api-keys/
│       │   └── dtos/
│       │       └── APIKeyDTO.ts
│       │
│       ├── data/
│       │   └── repositories/
│       │       └── PrismaAPIKeyRepository.ts
│       │
│       └── presentation/
│           ├── components/
│           │   ├── IntegrationsPanel.tsx
│           │   └── APIDocumentation.tsx
│           └── hooks/
│               └── useIntegrations.ts
│
├── infrastructure/                          # Shared infrastructure implementations
│   ├── persistence/
│   │   ├── prisma/
│   │   │   ├── client.ts                   # Prisma client singleton
│   │   │   ├── schema.prisma               # Master schema (from DbDiagram)
│   │   │   └── migrations/
│   │   │
│   │   ├── neo4j/
│   │   │   ├── client.ts                   # Neo4j driver
│   │   │   └── queries/
│   │   │       ├── skill-graph.cypher
│   │   │       └── relationship.cypher
│   │   │
│   │   ├── UnitOfWork.ts                   # Transaction management
│   │   └── TransactionManager.ts
│   │
│   ├── cache/
│   │   ├── RedisCache.ts                   # Redis implementation
│   │   ├── InMemoryCache.ts                # Fallback
│   │   └── CacheDecorator.ts               # Decorator pattern
│   │
│   ├── events/
│   │   ├── EventBus.ts                     # In-process event bus
│   │   ├── EventStore.ts                   # Event sourcing
│   │   └── handlers/
│   │       ├── UserActivityEventHandler.ts
│   │       └── NotificationEventHandler.ts
│   │
│   ├── messaging/
│   │   ├── RabbitMQPublisher.ts            # Message queue
│   │   └── KafkaProducer.ts                # For high-volume events
│   │
│   ├── ai-ml/
│   │   ├── models/
│   │   │   ├── prophet/
│   │   │   │   ├── model.pkl
│   │   │   │   └── ProphetModel.ts
│   │   │   ├── lstm/
│   │   │   │   ├── model.h5
│   │   │   │   └── LSTMModel.ts
│   │   │   └── embeddings/
│   │   │       └── SkillEmbedding.ts
│   │   │
│   │   ├── pipelines/
│   │   │   ├── DataPreprocessing.ts
│   │   │   ├── FeatureEngineering.ts
│   │   │   └── ModelInference.ts
│   │   │
│   │   └── services/
│   │       ├── LangChainService.ts         # LangChain integration
│   │       ├── OpenAIService.ts            # GPT integration
│   │       └── VectorStoreService.ts       # Embeddings storage
│   │
│   ├── blockchain/
│   │   ├── contracts/
│   │   │   ├── SkillToken.sol              # ERC-1155 contract
│   │   │   └── compiled/
│   │   │       └── SkillToken.json
│   │   │
│   │   ├── services/
│   │   │   ├── Web3Service.ts
│   │   │   ├── ContractService.ts
│   │   │   └── IPFSService.ts              # For token metadata
│   │   │
│   │   └── networks/
│   │       ├── polygon-testnet.config.ts
│   │       └── polygon-mainnet.config.ts
│   │
│   ├── logging/
│   │   ├── PinoLogger.ts                   # Structured logging
│   │   ├── LoggerMiddleware.ts
│   │   └── transports/
│   │       ├── ConsoleTransport.ts
│   │       └── CloudWatchTransport.ts
│   │
│   ├── monitoring/
│   │   ├── MetricsCollector.ts             # Prometheus metrics
│   │   ├── HealthCheck.ts                  # Health endpoints
│   │   └── APMService.ts                   # DataDog/New Relic
│   │
│   ├── http/
│   │   ├── AxiosClient.ts                  # HTTP client
│   │   └── interceptors/
│   │       ├── AuthInterceptor.ts
│   │       ├── ErrorInterceptor.ts
│   │       └── RetryInterceptor.ts
│   │
│   ├── security/
│   │   ├── JWTService.ts                   # Token management
│   │   ├── EncryptionService.ts            # Data encryption
│   │   ├── RateLimiter.ts                  # Rate limiting
│   │   └── CSRFProtection.ts
│   │
│   ├── storage/
│   │   ├── S3StorageService.ts             # AWS S3
│   │   ├── LocalStorageService.ts          # Development
│   │   └── FileUploadService.ts
│   │
│   └── search/
│       ├── ElasticsearchService.ts         # Full-text search
│       └── VectorSearchService.ts          # Semantic search
│
├── app/                                     # Next.js App Router
│   ├── api/                                 # API routes
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts                # NextAuth.js
│   │   │
│   │   ├── connectors/
│   │   │   ├── linkedin/
│   │   │   │   └── route.ts
│   │   │   ├── github/
│   │   │   │   └── route.ts
│   │   │   └── sync/
│   │   │       └── route.ts
│   │   │
│   │   ├── skills/
│   │   │   ├── route.ts
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── extract/
│   │   │   │   └── route.ts
│   │   │   └── graph/
│   │   │       └── route.ts
│   │   │
│   │   ├── forecasting/
│   │   │   ├── predict/
│   │   │   │   └── route.ts
│   │   │   └── trending/
│   │   │       └── route.ts
│   │   │
│   │   ├── learning/
│   │   │   ├── paths/
│   │   │   │   └── route.ts
│   │   │   └── courses/
│   │   │       └── route.ts
│   │   │
│   │   ├── tokens/
│   │   │   ├── mint/
│   │   │   │   └── route.ts
│   │   │   ├── verify/
│   │   │   │   └── route.ts
│   │   │   └── wallet/
│   │   │       └── route.ts
│   │   │
│   │   ├── marketplace/
│   │   │   ├── listings/
│   │   │   │   └── route.ts
│   │   │   └── purchase/
│   │   │       └── route.ts
│   │   │
│   │   ├── organizations/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── teams/
│   │   │       │   └── route.ts
│   │   │       └── analytics/
│   │   │           └── route.ts
│   │   │
│   │   ├── mentorship/
│   │   │   ├── mentors/
│   │   │   │   └── route.ts
│   │   │   └── bookings/
│   │   │       └── route.ts
│   │   │
│   │   ├── webhooks/
│   │   │   ├── blockchain/
│   │   │   │   └── route.ts
│   │   │   └── payments/
│   │   │       └── route.ts
│   │   │
│   │   └── middleware.ts                   # Global API middleware
│   │
│   ├── (auth)/                              # Auth route group (public)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (onboarding)/                        # Onboarding flow
│   │   ├── tour/
│   │   │   └── page.tsx
│   │   ├── connect-data/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                         # Main app (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # Individual dashboard
│   │   │
│   │   ├── skills/
│   │   │   ├── page.tsx                    # Skill overview
│   │   │   ├── dna/
│   │   │   │   └── page.tsx
│   │   │   ├── graph/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── forecast/
│   │   │   ├── page.tsx
│   │   │   └── trends/
│   │   │       └── page.tsx
│   │   │
│   │   ├── learning/
│   │   │   ├── page.tsx
│   │   │   ├── paths/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── courses/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── gamification/
│   │   │   └── page.tsx
│   │   │
│   │   ├── wallet/
│   │   │   ├── page.tsx
│   │   │   └── tokens/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── marketplace/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── mentorship/
│   │   │   ├── page.tsx
│   │   │   ├── mentors/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── sessions/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── (enterprise)/                        # Enterprise dashboards
│   │   ├── layout.tsx
│   │   ├── overview/
│   │   │   └── page.tsx
│   │   ├── teams/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── talent/
│   │   │   ├── page.tsx                    # Talent pool search
│   │   │   └── [userId]/
│   │   │       └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── integrations/
│   │       └── page.tsx
│   │
│   ├── (admin)/                             # Admin console
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── organizations/
│   │   │   └── page.tsx
│   │   ├── tokens/
│   │   │   └── page.tsx
│   │   ├── compliance/
│   │   │   └── page.tsx
│   │   └── audit-logs/
│   │       └── page.tsx
│   │
│   ├── layout.tsx                           # Root layout
│   ├── page.tsx                             # Landing page
│   ├── error.tsx                            # Error boundary
│   ├── loading.tsx                          # Loading UI
│   ├── not-found.tsx                        # 404 page
│   └── global-error.tsx                     # Global error handler
│
├── shared/                                  # Shared UI & utilities
│   ├── components/
│   │   ├── ui/                              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layouts/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── charts/                          # Reusable chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── HeatmapChart.tsx
│   │   │   └── RadarChart.tsx
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── useWebSocket.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                         # Common utilities
│   │   ├── cn.ts                            # Class name helper
│   │   └── format.ts                        # Formatters
│   │
│   └── styles/
│       ├── globals.css
│       └── themes/
│           ├── light.css
│           └── dark.css
│
├── tests/                                   # Test suites
│   ├── unit/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── value-objects/
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   └── queries/
│   │   └── infrastructure/
│   │
│   ├── integration/
│   │   ├── api/
│   │   ├── repositories/
│   │   └── services/
│   │
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── skills.spec.ts
│   │   ├── learning.spec.ts
│   │   └── tokens.spec.ts
│   │
│   └── helpers/
│       ├── factories/
│       ├── fixtures/
│       └── mocks/
│
├── docs/                                    # Documentation
│   ├── architecture/
│   │   ├── decisions/                       # ADRs
│   │   │   ├── 001-cqrs-pattern.md
│   │   │   ├── 002-blockchain-integration.md
│   │   │   └── 003-ai-ml-pipeline.md
│   │   ├── diagrams/
│   │   │   ├── system-architecture.png
│   │   │   ├── data-flow.png
│   │   │   └── deployment.png
│   │   └── README.md
│   │
│   ├── api/
│   │   ├── openapi.yaml
│   │   └── postman-collection.json
│   │
│   └── guides/
│       ├── getting-started.md
│       ├── development.md
│       └── deployment.md
│
├── scripts/                                 # Utility scripts
│   ├── seed/
│   │   ├── users.ts
│   │   ├── skills.ts
│   │   └── organizations.ts
│   ├── migrations/
│   │   └── run-migrations.ts
│   ├── ml-training/
│   │   ├── train-prophet.py
│   │   └── train-lstm.py
│   └── deploy/
│       └── deploy.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── test.yml
│
├── .env.example
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── package.json
├── docker-compose.yml
├── Dockerfile
└── README