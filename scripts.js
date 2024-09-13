document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const errorMessage = document.querySelector('.authorization__error-message');
    const button = document.querySelector('.authorization__button');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');

    const resetInputs = () => {
        [loginInput, passwordInput].forEach(input => {
            input.classList.remove('authorization__input--error', 'authorization__input--success');
        });
        errorMessage.classList.add('d-none');
    };

    const displayMessage = (message, isSuccess) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<p class="${isSuccess ? 'success__text' : 'error__text'}">${message}</p>`;
        messageElement.className = isSuccess ? 'authorization__success-message' : 'authorization__error-message';
        document.querySelector('.authorization-container').appendChild(messageElement);
    };

    const handleResponse = (data) => {
        if (data.status === 'ok') {
            document.cookie = `token=${data.token}; path=/`;
            authForm.classList.add('d-none');
            displayMessage(`${data.user.name}, Вы успешно авторизованы!`, true);
            [loginInput, passwordInput].forEach(input => input.classList.add('authorization__input--success'));
        } else {
            showError(data.errorMessage || 'Произошла ошибка.', data.errorCode);
        }
    };

    const showError = (message, errorCode) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');

        const errorInputs = {
            'incorrectLoginOrPassword': [loginInput, passwordInput],
            'passwordLength': [passwordInput],
            'paramsLoginRequired': [loginInput],
            'paramsPhoneIncorrect': [loginInput],
            'missingPassword': [passwordInput],
        };

        if (errorInputs[errorCode]) {
            errorInputs[errorCode].forEach(input => input.classList.add('authorization__input--error'));
        }
    };

    const validateInputs = () => {
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        if (!login) {
            showError('Логин не может быть пустым.', null);
            loginInput.classList.add('authorization__input--error');
            isValid = false;
        }

        if (!password) {
            showError('Пароль не может быть пустым.', null);
            passwordInput.classList.add('authorization__input--error');
            isValid = false;
        }

        return isValid;
    };

    const submitForm = async (event) => {
        event.preventDefault();

        resetInputs();

        if (!validateInputs()) return;

        button.disabled = true;
        button.textContent = 'Загрузка...';

        try {
            const response = await fetch(`https://test-works.pr-uni.ru/api/login/index.php?login=${encodeURIComponent(loginInput.value.trim())}&password=${encodeURIComponent(passwordInput.value.trim())}`);
            const data = await response.json();
            handleResponse(data);
        } catch {
            showError('Ошибка сети. Пожалуйста, попробуйте еще раз.', null);
            [loginInput, passwordInput].forEach(input => input.classList.add('authorization__input--error'));
        } finally {
            button.disabled = false;
            button.textContent = 'Войти';
        }
    };

    authForm.addEventListener('submit', submitForm);
});