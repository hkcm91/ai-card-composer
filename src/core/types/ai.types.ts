/**
 * AI Service Types
 *
 * Defines interfaces for AI generation services that can be plugged into
 * the pipeline (Nana Banana, Midjourney, DALL-E, Stable Diffusion, etc.)
 */

import type { BlendMode } from './widget.types';

// =============================================================================
// AI SERVICE PROVIDER INTERFACE
// =============================================================================

export interface AIServiceProvider {
  /** Unique identifier for this provider */
  name: string;

  /** Display name for UI */
  displayName: string;

  /** Provider capabilities */
  capabilities: AICapabilities;

  /** Generate a single image from prompt */
  generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse>;

  /** Compose multiple layers into a single image (if supported) */
  composeImage?(request: AICompositionRequest): Promise<AIGenerationResponse>;

  /** Apply style transfer from reference image (if supported) */
  styleTransfer?(request: AIStyleTransferRequest): Promise<AIGenerationResponse>;

  /** Estimate cost for a generation request */
  estimateCost?(request: AIGenerationRequest): CostEstimate;

  /** Check if the service is available */
  isAvailable(): Promise<boolean>;

  /** Validate API credentials */
  validateCredentials(): Promise<boolean>;
}

export interface AICapabilities {
  imageGeneration: boolean;
  imageComposition: boolean;
  styleTransfer: boolean;
  inpainting: boolean;
  outpainting: boolean;
  upscaling: boolean;
  variations: boolean;
  controlNet: boolean;
  maxWidth: number;
  maxHeight: number;
  supportedAspectRatios: string[];
}

// =============================================================================
// AI GENERATION REQUESTS
// =============================================================================

export interface AIGenerationRequest {
  /** The main prompt describing desired output */
  prompt: string;

  /** Things to avoid in the generation */
  negativePrompt?: string;

  /** Output dimensions */
  width: number;
  height: number;

  /** Reference images for style guidance */
  referenceImages?: ReferenceImage[];

  /** Style preset name */
  style?: string;

  /** Seed for reproducibility */
  seed?: number;

  /** Number of images to generate */
  count?: number;

  /** Generation quality (affects speed/cost) */
  quality?: 'draft' | 'standard' | 'high' | 'ultra';

  /** Provider-specific options */
  providerOptions?: Record<string, any>;

  /** Safe zones where AI should keep clear for text */
  safeZones?: SafeZone[];

  /** Guidance scale / CFG scale */
  guidanceScale?: number;

  /** Number of inference steps */
  steps?: number;
}

export interface ReferenceImage {
  /** Base64 or URL of the reference image */
  image: string;

  /** How much to weight this reference (0-1) */
  weight: number;

  /** What aspect to reference */
  type: 'style' | 'composition' | 'color' | 'content';
}

export interface SafeZone {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'text' | 'logo' | 'keep-clear';
}

// =============================================================================
// AI COMPOSITION REQUESTS
// =============================================================================

export interface AICompositionRequest {
  /** Layers to composite */
  layers: CompositionLayer[];

  /** Final output dimensions */
  width: number;
  height: number;

  /** Blending instructions for AI */
  blendingPrompt?: string;

  /** Style to apply to final composition */
  style?: string;

  /** Whether to harmonize colors across layers */
  harmonizeColors?: boolean;
}

export interface CompositionLayer {
  /** Unique identifier for this layer */
  id: string;

  /** Layer type */
  type: 'background' | 'subject' | 'overlay' | 'text' | 'decoration';

  /** Image data (base64 or URL) */
  image: string;

  /** Layer position */
  position?: { x: number; y: number };

  /** Layer dimensions */
  size?: { width: number; height: number };

  /** Blend mode */
  blendMode?: BlendMode;

  /** Layer opacity (0-1) */
  opacity?: number;

  /** Z-index for stacking */
  zIndex?: number;

  /** Optional mask for this layer */
  mask?: string;
}

// =============================================================================
// AI STYLE TRANSFER REQUESTS
// =============================================================================

export interface AIStyleTransferRequest {
  /** Source image to transform */
  sourceImage: string;

  /** Style reference image */
  styleImage: string;

  /** How strongly to apply the style (0-1) */
  strength: number;

  /** Preserve content structure level (0-1) */
  contentPreservation: number;

  /** Output dimensions */
  width: number;
  height: number;

  /** Additional style instructions */
  stylePrompt?: string;
}

// =============================================================================
// AI GENERATION RESPONSES
// =============================================================================

export interface AIGenerationResponse {
  /** Whether generation was successful */
  success: boolean;

  /** Generated images */
  images: GeneratedImage[];

  /** Error information if failed */
  error?: AIError;

  /** Generation metadata */
  metadata: GenerationMetadata;

  /** Usage/billing information */
  usage?: UsageInfo;
}

export interface GeneratedImage {
  /** Image URL (temporary, may expire) */
  url?: string;

  /** Base64 encoded image */
  base64?: string;

  /** Image format */
  format: 'png' | 'jpg' | 'webp';

  /** Image dimensions */
  width: number;
  height: number;

  /** Seed used for this specific image */
  seed?: number;
}

export interface GenerationMetadata {
  /** Provider used */
  provider: string;

  /** Model name/version */
  model: string;

  /** Time to generate in milliseconds */
  generationTime: number;

  /** Request ID for tracking */
  requestId: string;

  /** Timestamp */
  timestamp: Date;

  /** Final prompt used (may differ from input after processing) */
  finalPrompt?: string;

  /** Final negative prompt used */
  finalNegativePrompt?: string;
}

export interface AIError {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, any>;
}

export interface UsageInfo {
  creditsUsed: number;
  creditsRemaining?: number;
  estimatedCost?: number;
  currency?: string;
}

export interface CostEstimate {
  credits: number;
  estimatedCost: number;
  currency: string;
  breakdown?: CostBreakdown[];
}

export interface CostBreakdown {
  item: string;
  cost: number;
}

// =============================================================================
// PROMPT BUILDING
// =============================================================================

export interface PromptBuilder {
  /** Build a complete prompt from template and variables */
  build(template: PromptTemplate, variables: PromptVariables): string;

  /** Add quality enhancers to prompt */
  addQualityEnhancers(prompt: string, enhancers: string[]): string;

  /** Build negative prompt */
  buildNegativePrompt(baseNegatives: string[], additions?: string[]): string;
}

export interface PromptTemplate {
  base: string;
  sections?: PromptSection[];
  suffix?: string;
}

export interface PromptSection {
  name: string;
  content: string;
  required: boolean;
}

export interface PromptVariables {
  widgetType?: string;
  style?: string;
  mood?: string;
  width?: number;
  height?: number;
  primaryColor?: string;
  brandDescription?: string;
  safeZones?: string;
  [key: string]: any;
}

// =============================================================================
// AI WORKFLOW STATE
// =============================================================================

export interface AIWorkflowState {
  /** Current status */
  status: AIWorkflowStatus;

  /** Current step in workflow */
  currentStep: number;

  /** Total steps in workflow */
  totalSteps: number;

  /** Progress percentage (0-100) */
  progress: number;

  /** Generated results so far */
  results: GeneratedImage[];

  /** Current generation request */
  currentRequest?: AIGenerationRequest;

  /** Error if any */
  error?: AIError;

  /** Timing information */
  timing: {
    startTime?: Date;
    endTime?: Date;
    stepTimes: number[];
  };
}

export type AIWorkflowStatus =
  | 'idle'
  | 'preparing'
  | 'generating'
  | 'compositing'
  | 'post-processing'
  | 'complete'
  | 'error'
  | 'cancelled';

// =============================================================================
// PROVIDER-SPECIFIC CONFIGURATIONS
// =============================================================================

export interface NanaBananaConfig {
  apiKey: string;
  apiEndpoint?: string;
  defaultModel?: string;
  defaultStyle?: string;
}

export interface MidjourneyConfig {
  discordToken: string;
  serverId: string;
  channelId: string;
  defaultSuffix?: string;
}

export interface OpenAIConfig {
  apiKey: string;
  organization?: string;
  model?: 'dall-e-2' | 'dall-e-3';
  quality?: 'standard' | 'hd';
}

export interface StableDiffusionConfig {
  apiKey?: string;
  endpoint?: string;
  model?: string;
  scheduler?: string;
}

export interface ReplicateConfig {
  apiToken: string;
  model?: string;
  version?: string;
}

export type AIProviderConfig =
  | NanaBananaConfig
  | MidjourneyConfig
  | OpenAIConfig
  | StableDiffusionConfig
  | ReplicateConfig;
