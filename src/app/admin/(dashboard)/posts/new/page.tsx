import PostForm from "@/components/admin/PostForm";

export const metadata = { title: "新增文章" };

export default function NewPostPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-2xl font-bold">新增文章</h1>
      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
}
