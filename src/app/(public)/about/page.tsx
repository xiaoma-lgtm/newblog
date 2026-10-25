import type { Metadata } from "next";

export const metadata: Metadata = { title: "关于我" };

/**
 * 个人信息配置：改这里即可更新"关于我"页面
 */
const profile = {
  name: "博主",
  avatar: "👨‍💻",
  bio: "一名热爱技术的开发者，喜欢折腾新东西，也喜欢把踩过的坑记录下来。",
  intro: [
    "欢迎来到我的博客！这里主要记录我在技术、阅读和生活中的一些思考与总结。",
    "我相信写作是最好的学习方式——把学到的写下来，讲给别人听，知识才真正属于自己。",
    "如果你对这里的某篇文章有想法，欢迎通过下面的方式联系我交流。",
  ],
  contact: [
    { label: "邮箱", value: "you@example.com", href: "mailto:you@example.com" },
    { label: "微信", value: "your_wechat_id" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/yourname" },
    { label: "掘金", href: "https://juejin.cn/user/yourid" },
    { label: "知乎", href: "https://www.zhihu.com/people/yourid" },
  ],
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">关于我</h1>

      <div className="mt-8 flex flex-col items-center gap-6 rounded-xl border border-black/10 p-8 sm:flex-row sm:items-start dark:border-white/10">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-4xl">
          {profile.avatar}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {profile.bio}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">自我介绍</h2>
        <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {profile.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold">联系方式</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {profile.contact.map((item) => (
              <li key={item.label} className="flex gap-2">
                <span className="w-12 shrink-0 text-zinc-500">{item.label}</span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">社交链接</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {profile.socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {item.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
