import React, {useEffect, useState, useCallback} from 'react';
import { getJobs } from '../api/JobApi';

interface Job{
    id: number;
    title: string;
    category: string;
    salary: number;
}

const categoriesData = [
    "事務",
    "エンジニア",
    "営業",
    "デザイン",
    "マーケティング",
    "財務・経理",
    "人事",
    "カスタマーサポート",
    "製造",
    "医療・介護",    
];

const salaryOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

const JobListPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSalary, setSelectedSalary] = useState<number | undefined>();
    const [page, setPage] = useState(1);

    const fetchJobList = useCallback(async () => {
        try {
            const data = await getJobs(page, selectedCategories, selectedSalary);
            setJobs(data.jobs);
            setTotalCount(data.total_count);
        } catch (error) {
            console.error(error);
        }
    }, [page, selectedCategories, selectedSalary]);
    
    useEffect(() => {
        fetchJobList();
    }, [fetchJobList]);

    const handleCategoryChange = (category: string) => {
        if (selectedCategories.includes(category)){
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        }else{
            setSelectedCategories([...selectedCategories, category]);
        }
        setPage(1); 
    };
    //dropdown
    const handleSalaryChange = (salary: number) => {
        setSelectedSalary(salary);
        setPage(1); 
    }
    //pagenation
    const perPage = 10;
    const totalPages = Math.ceil(totalCount / perPage);

    return (
    <div className="min-h-screen flex flex-col">
        <header className="bg-blue-900 text-white p-4 flex justify-between">
            <div className="font-bold text-xl">求人検索アプリ</div>
            <div>
            <a href="/" className="mr-4">求人検索</a>
            <a href="/post">求人投稿</a>
            </div>
        </header>

        <div className="flex flex-1">
            {/* 左サイドバー */}
            <div className="w-1/4 p-4 bg-gray-100">
            <h2 className="font-bold mb-2">求人カテゴリ</h2>
            <div className="flex flex-col mb-4">
                {categoriesData.map((cat) => (
                <label key={cat} className="inline-flex items-center mb-1">
                    <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    />
                    {cat}
                </label>
                ))}
            </div>

            <h2 className="font-bold mb-2">年収</h2>
            <select
                className="border p-1"
                value={selectedSalary ?? ""}
                onChange={(e) => handleSalaryChange(Number(e.target.value))}
            >
                <option value="">指定なし</option>
                {salaryOptions.map(s => (
                <option key={s} value={s}>{s}万円以上</option>
                ))}
            </select>
            </div>

            {/* 右コンテンツ */}
            <div className="w-3/4 p-4">
            <div className="mb-4">求人件数: {totalCount}件</div>

            <div className="space-y-4">
                {jobs.map(job => (
                <div key={job.id} className="border p-4 rounded shadow">
                    <div className="font-bold">{job.title}</div>
                    <div>カテゴリ: {job.category}</div>
                    <div>年収: {job.salary}万円</div>
                </div>
                ))}
            </div>

            {/* ページネーション */}
        {totalPages > 1 && (
            <div className="flex gap-2 justify-center mt-4">
                {/* 前のページボタン */}
                <button
                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                    className="px-3 py-1 border rounded bg-white"
                    disabled={page === 1}
                >
                    &lt;
                </button>

                {/* ページ番号 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    // 現在のページを中心に計算
                    const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
                    const pageNumber = startPage + index;

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-3 py-1 border rounded ${
                                pageNumber === page ? 'bg-blue-600 text-white' : 'bg-white'
                            }`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                {/* 次のページボタン */}
                <button
                    onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                    className="px-3 py-1 border rounded bg-white"
                    disabled={page === totalPages}
                >
                    &gt;
                </button>
            </div>
        )}

            </div>
        </div>
    </div>
    );
};

export default JobListPage;