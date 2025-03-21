import { IsInt, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsString, IsArray } from 'class-validator';
import { TrackerMode, TrackerMuscle, TrackerVisual } from 'src/shared/enums';

export class CreateTraceDto {
  @IsInt()
  @IsOptional()
  presetId?: number;

  @IsEnum(TrackerMuscle)
  @IsNotEmpty()
  muscle: TrackerMuscle;

  @IsEnum(TrackerMode)
  @IsNotEmpty()
  mode: TrackerMode;

  @IsEnum(TrackerVisual)
  @IsNotEmpty()
  visual: TrackerVisual;

  @IsInt()
  totalReps: number;

  @IsInt()
  effectiveReps: number;

  @IsNumber()
  effectiveness: number;

  @IsNumber()
  envelopeBase: number;

  @IsArray()
  envelopeData: number[];

  @IsArray()
  repPeaks: number[];

  @IsInt()
  duration: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
