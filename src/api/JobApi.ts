import axios from "axios";
const baseURL = process.env.REACT_APP_API_BASE_URL ||'http://localhost:3001/api/v1';

const api = axios.create({
    baseURL,
});

export const getJobs = async (page: number, categories: string[], salaryMin?: number) => {
    // const params: any = {page}; 
    interface JobParams {
        page: number;
        category?: string; // カンマ区切りのカテゴリ文字列
        salary_min?: number;
    }
    
    const params: JobParams = { page };

    if (categories.length > 0){
        params.category = categories.join(','); 
    }
    if (salaryMin){
        params.salary_min = salaryMin;
    }

    try {
    const response = await api.get('./jobs', { params });
    return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error; // 必要に応じてエラーを再スロー
    }
};

export const postJob = async (title: string, category: string, salary: number) => {
    const res = await api.post('/jobs', {
        job:{
            title,
            category,
            salary,
        },
    });
    return res.data;
};