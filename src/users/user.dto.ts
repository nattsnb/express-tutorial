import { IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  public nickname: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

export default CreateUserDto;
