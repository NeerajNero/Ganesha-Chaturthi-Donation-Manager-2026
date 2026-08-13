import { CommentModerator } from "./_components/comment-moderator";

export default function AdminCommentsPage() {
  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Comment Moderation</h1>
        <p className="text-sm text-gray-600">
          Review and approve or reject public comments on gallery photos.
        </p>
      </div>
      <CommentModerator />
    </main>
  );
}
