import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TrackerMode, TrackerMuscle, TrackerVisual } from 'src/shared/enums';

export class CreatePresetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TrackerMode)
  @IsNotEmpty()
  mode: TrackerMode;

  @IsEnum(TrackerMuscle)
  @IsNotEmpty()
  muscle: TrackerMuscle;

  @IsEnum(TrackerVisual)
  @IsNotEmpty()
  visual: TrackerVisual;
}
