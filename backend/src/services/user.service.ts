import * as Boom from "@hapi/boom";
import { IUser, IUserDocument, IUserResponse } from "../interfaces/user.interface";
import { User } from "../models/User";

export class UserService {
  public async findAllUsers(): Promise<IUserResponse[]> {
    const users = await User.find().select("-password").lean();
    return users;
  }

  public async findUserById(id: string): Promise<IUserResponse> {
    const user = await User.findById(id).select("-password");
    if (!user) throw Boom.notFound("User not found");
    return user.toObject();
  }

  public async findUserByEmail(email: string): Promise<IUserResponse | null> {
    const user = await User.findOne({ email }).select("-password");
    if (!user) throw Boom.notFound("User not found");
    return user?.toObject();
  }

  public async findUserByEmailWithPassword(
    email: string
  ): Promise<IUserDocument | null> {
    return User.findOne({ email }).select("+password");
  }

  public async createUser(userData: IUser): Promise<IUserResponse> {
    const existing = await User.findOne({ email: userData.email });
    if (existing) throw Boom.conflict("Email already in use");
    const existingName = await User.findOne({ name: userData.name });
    if (existingName) throw Boom.conflict("Name already in use");

    const user = await User.create(userData);
    return user.toObject();
  }

  public async updateUser(
    id: string,
    data: Partial<IUser>
  ): Promise<IUserResponse> {
    const user = await User.findByIdAndUpdate(id, data, { new: true }).select(
      "-password"
    );
    if (!user) throw Boom.notFound("User not found");
    return user.toObject();
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw Boom.notFound("User not found");
  }
}
