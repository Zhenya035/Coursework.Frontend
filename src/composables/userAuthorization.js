import { ref } from 'vue';
import authApi from '@/api/api';
import { useRouter } from 'vue-router';

export default function userAuthorization() {
    const formData = ref({
        email: '',
        password: '',
    });

    const loading = ref(false);
    const error = ref(null);

    const router = useRouter();

    const submitForm = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await authApi.login(formData.value);
            console.log('Успех:', response.data);
            const {id, token, role} = response.data;

            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', role);

            if(role === 'Admin')
                await router.push('/users');
            else
                await router.push('/templates');
        } catch (err) {
            console.error('Authorization error', err);
                error.value = err.response?.data?.message || 'Authorization error';
        } finally {
            loading.value = false;
        }
    };

    return {
        formData,
        loading,
        error,
        submitForm,
    };
}