export class LogoutUseCase {
  execute(userID: string): void {
    if (!userID) {
      throw new Error('Không tìm thấy thông tin người dùng!');
    }
  }
}
