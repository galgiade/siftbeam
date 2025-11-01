// アカウント削除関連のユーティリティ関数

// 削除予定日を計算（90日後）
export function calculateDeletionDate(deletionRequestedAt: string): Date {
  const requestDate = new Date(deletionRequestedAt);
  const deletionDate = new Date(requestDate);
  deletionDate.setDate(deletionDate.getDate() + 90);
  return deletionDate;
}

// 削除までの残り日数を計算
export function calculateDaysUntilDeletion(deletionRequestedAt: string): number {
  const deletionDate = calculateDeletionDate(deletionRequestedAt);
  const now = new Date();
  const diffTime = deletionDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

