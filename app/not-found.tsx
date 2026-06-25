import Link from "next/link";

/**
 * カスタム 404 ページ。
 * Next.js App Router の not-found 規約に従い、このファイルが存在するだけで
 * notFound() 呼び出し時や存在しないルートへのアクセス時に使われる。
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-foreground">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-bold">ページが見つかりません</h1>
        <p className="text-sm text-muted-foreground">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          トップページへ戻る
        </Link>
      </div>
    </main>
  );
}
