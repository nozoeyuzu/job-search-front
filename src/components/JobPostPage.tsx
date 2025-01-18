import React, { useState } from 'react';
import { postJob } from '../api/JobApi';

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

const JobPostPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [salary, setSalary] = useState<number | "">("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!title || !category || !salary){
            alert("すべての項目を入力してください");
            return;
        }
        try{
            await postJob(title, category, Number(salary));
            window.location.href = "/";
            // console.log("Clicked submit!");
        }catch(error){
            console.error(error);
            alert("投稿に失敗しました");
        }
    };

    return(
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-900 text-white p-4 flex justify-between">
            <div className="font-bold text-xl">求人検索アプリ</div>
            <div>
                <a href="/" className="mr-4">求人検索</a>
                <a href="/post">求人投稿</a>
            </div>
            </header>
    
            <div className="flex flex-1 justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl font-bold mb-4">求人投稿</h2>
                
                <label className="block mb-2">
                カテゴリを選択
                <select
                    className="border w-full p-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">選択してください</option>
                    {categoriesData.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                </label>
    
                <label className="block mb-2">
                年収 (万円)
                <input
                    type="number"
                    className="border w-full p-2"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : "")}
                />
                </label>
    
                <label className="block mb-4">
                求人タイトル
                <input
                    type="text"
                    className="border w-full p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                </label>
    
                <button
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                投稿
                </button>
            </form>
            </div>
        </div>
    );
};
export default JobPostPage;