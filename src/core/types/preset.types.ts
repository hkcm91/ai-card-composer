/**
 * Preset Types
 *
 * Presets allow users to save and reuse widget configurations,
 * including field defaults, design settings, and AI preferences.
 */

import type { AIProvider, AIGenerationRequest } from './ai.types';
import type { ColorScheme, ExportFormat, ResolutionConfig } from './widget.types';

// =============================================================================
// PRESET DEFINITION
// =============================================================================

export interface Preset {
  /** Unique identifier */
  id: string;

  /** User-defined name */
  name: string;

  /** Optional description */
  description?: string;

  /** Widget this preset is for */
  widgetId: string;

  /** Template to use */
  templateId: string;

  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;

  /** User who created (for multi-user systems) */
  createdBy?: string;

  /** Default values for fields */
  fieldDefaults: Record<string, any>;

  /** Design configuration */
  design: PresetDesign;

  /** AI generation settings */
  aiSettings: PresetAISettings;

  /** Export preferences */
  exportDefaults: PresetExportSettings;

  /** Tags for organization */
  tags?: string[];

  /** Whether this is a favorite */
  isFavorite?: boolean;

  /** Usage count for sorting */
  usageCount?: number;

  /** Last used timestamp */
  lastUsedAt?: Date;

  /** Thumbnail preview */
  thumbnail?: string;
}

export interface PresetDesign {
  /** Background color */
  backgroundColor: string;

  /** Text color */
  textColor: string;

  /** Accent color */
  accentColor?: string;

  /** Secondary color */
  secondaryColor?: string;

  /** Background image (stored as reference) */
  backgroundImage?: string;

  /** Color scheme name if using preset */
  colorSchemeName?: string;

  /** Custom CSS overrides */
  customStyles?: Record<string, string>;
}

export interface PresetAISettings {
  /** Preferred AI provider */
  preferredProvider?: AIProvider | 'auto';

  /** Style preset name */
  stylePreset?: string;

  /** Reference images for AI generation */
  referenceImages?: PresetReferenceImage[];

  /** Default prompt modifiers */
  promptModifiers?: string[];

  /** Default negative prompts to add */
  negativePrompts?: string[];

  /** Quality preference */
  quality?: 'draft' | 'standard' | 'high' | 'ultra';

  /** Saved generation parameters */
  generationParams?: Partial<AIGenerationRequest>;
}

export interface PresetReferenceImage {
  /** Storage reference (local or cloud URL) */
  url: string;

  /** Display name */
  name: string;

  /** Weight when used */
  weight: number;

  /** What aspect to reference */
  type: 'style' | 'composition' | 'color' | 'content';

  /** Thumbnail for preview */
  thumbnail?: string;
}

export interface PresetExportSettings {
  /** Default format */
  format: ExportFormat;

  /** Default resolution preset name */
  resolution: string;

  /** Custom resolution override */
  customResolution?: ResolutionConfig;

  /** Filename template */
  filenameTemplate?: string;

  /** Include bleed in export */
  includeBleed?: boolean;

  /** Auto-generate variations */
  generateVariations?: boolean;
}

// =============================================================================
// PRESET COLLECTIONS
// =============================================================================

export interface PresetCollection {
  /** Collection ID */
  id: string;

  /** Collection name */
  name: string;

  /** Description */
  description?: string;

  /** Preset IDs in this collection */
  presetIds: string[];

  /** Collection thumbnail */
  thumbnail?: string;

  /** Whether this is a system collection */
  isSystem?: boolean;

  /** Sort order */
  sortOrder?: number;
}

// =============================================================================
// PRESET STORAGE
// =============================================================================

export interface PresetStorage {
  /** Save a preset */
  save(preset: Preset): Promise<Preset>;

  /** Get a preset by ID */
  get(id: string): Promise<Preset | null>;

  /** Get all presets for a widget */
  getByWidget(widgetId: string): Promise<Preset[]>;

  /** Get all presets */
  getAll(): Promise<Preset[]>;

  /** Update a preset */
  update(id: string, updates: Partial<Preset>): Promise<Preset>;

  /** Delete a preset */
  delete(id: string): Promise<void>;

  /** Duplicate a preset */
  duplicate(id: string, newName?: string): Promise<Preset>;

  /** Search presets */
  search(query: PresetSearchQuery): Promise<Preset[]>;

  /** Export presets to file */
  export(ids: string[]): Promise<ExportedPresets>;

  /** Import presets from file */
  import(data: ExportedPresets): Promise<Preset[]>;
}

export interface PresetSearchQuery {
  /** Text search in name/description */
  text?: string;

  /** Filter by widget ID */
  widgetId?: string;

  /** Filter by tags */
  tags?: string[];

  /** Filter by favorite status */
  isFavorite?: boolean;

  /** Sort by */
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsedAt';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';

  /** Pagination */
  limit?: number;
  offset?: number;
}

export interface ExportedPresets {
  version: string;
  exportedAt: Date;
  presets: Preset[];
  assets?: ExportedAsset[];
}

export interface ExportedAsset {
  id: string;
  type: 'image' | 'font' | 'other';
  data: string;  // Base64 encoded
  mimeType: string;
  originalUrl: string;
}

// =============================================================================
// QUICK PRESETS (Lightweight)
// =============================================================================

/**
 * QuickPreset is a lightweight preset for common quick-apply scenarios
 * like color schemes or font combinations
 */
export interface QuickPreset {
  id: string;
  name: string;
  type: QuickPresetType;
  thumbnail?: string;
  data: QuickPresetData;
}

export type QuickPresetType =
  | 'color-scheme'
  | 'font-combo'
  | 'layout-style'
  | 'ai-style';

export type QuickPresetData =
  | ColorScheme
  | FontCombo
  | LayoutStyle
  | AIStyle;

export interface FontCombo {
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
}

export interface LayoutStyle {
  templateId: string;
  fieldOverrides?: Record<string, Partial<{
    fontSize: number;
    fontWeight: string;
    textAlign: string;
  }>>;
}

export interface AIStyle {
  name: string;
  prompt: string;
  negativePrompt?: string;
  referenceImage?: string;
}

// =============================================================================
// PRESET EVENTS
// =============================================================================

export type PresetEventType =
  | 'preset:created'
  | 'preset:updated'
  | 'preset:deleted'
  | 'preset:applied'
  | 'preset:duplicated'
  | 'preset:imported'
  | 'preset:exported';

export interface PresetEvent {
  type: PresetEventType;
  presetId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type PresetEventHandler = (event: PresetEvent) => void;
