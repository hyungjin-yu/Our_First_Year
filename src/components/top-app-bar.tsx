"use client";

export function TopAppBar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 w-full bg-[#fdf8f5] dark:bg-[#34322f] fixed z-40 top-0 transition-opacity duration-300 active:opacity-70">
      <button className="text-primary dark:text-primary-fixed hover:bg-surface-container-low dark:hover:bg-[#3d3b38] rounded-full p-2 transition-colors">
        <span className="material-symbols-outlined">menu</span>
      </button>
      <h1 className="font-headline text-xl tracking-tight font-bold text-primary dark:text-primary-fixed">
        우리 이야기
      </h1>
      <button className="text-primary dark:text-primary-fixed hover:bg-surface-container-low dark:hover:bg-[#3d3b38] rounded-full p-2 transition-colors">
        <span className="material-symbols-outlined">account_circle</span>
      </button>
    </header>
  );
}
