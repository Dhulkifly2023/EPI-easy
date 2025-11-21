document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Obter Elementos do DOM ---
    const quizTitleEl = document.getElementById('quiz-title');
    const questionTextEl = document.getElementById('question-text');
    const answerButtonsEl = document.getElementById('answer-buttons');
    const nextBtn = document.getElementById('next-btn');
    const feedbackTextEl = document.getElementById('feedback-text');
    
    const quizHeaderEl = document.getElementById('quiz-header');
    const questionContainerEl = document.getElementById('question-container');
    const controlsEl = document.getElementById('controls');
    
    const resultsContainerEl = document.getElementById('results-container');
    const resultsIconEl = document.getElementById('results-icon');
    const scoreTextEl = document.getElementById('score-text');
    const scorePercentageEl = document.getElementById('score-percentage');
    const scoreFeedbackEl = document.getElementById('score-feedback');
    const restartBtn = document.getElementById('restart-btn');

    const progressTextEl = document.getElementById('progress-text');
    const progressBarEl = document.getElementById('progress-bar');

    // --- 2. Variáveis de Estado do Quiz ---
    let allQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentQuizName = '';

    // --- 3. Funções Principais ---

    /**
     * Carrega o quiz com base no parâmetro URL (ex: ?aula=capacete)
     */
    async function loadQuiz() {
        try {
            const params = new URLSearchParams(window.location.search);
            const aula = params.get('aula');
            
            if (!aula) {
                quizTitleEl.textContent = 'Erro: Quiz não encontrado';
                questionTextEl.textContent = 'Por favor, selecione um quiz a partir da página de aulas.';
                return;
            }

            currentQuizName = aula;
            const jsonFile = `quizdata/${aula}.json`;
            
            const response = await fetch(jsonFile);
            if (!response.ok) {
                throw new Error('Não foi possível carregar o ficheiro .json do quiz.');
            }
            allQuestions = await response.json();
            
            // Define o título da página e do quiz
            const quizTitle = `Quiz: ${aula.charAt(0).toUpperCase() + aula.slice(1)}`;
            document.title = `${quizTitle} - EPI Easy`;
            quizTitleEl.textContent = quizTitle;

            startQuiz();

        } catch (error) {
            console.error('Erro ao carregar o quiz:', error);
            quizTitleEl.textContent = 'Erro ao Carregar';
            questionTextEl.textContent = 'Não foi possível encontrar as perguntas. Tente voltar e selecionar a aula novamente.';
        }
    }

    /**
     * Inicia ou reinicia o quiz
     */
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        resultsContainerEl.style.display = 'none';
        quizHeaderEl.style.display = 'block';
        questionContainerEl.style.display = 'block';
        controlsEl.style.display = 'block';
        nextBtn.style.display = 'none';
        
        showQuestion();
    }

    /**
     * Mostra a pergunta atual e as opções de resposta
     */
    function showQuestion() {
        resetState();
        
        const question = allQuestions[currentQuestionIndex];
        questionTextEl.textContent = question.question;

        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('answer-btn');
            
            if (answer.correct) {
                button.dataset.correct = true;
            }
            
            button.addEventListener('click', selectAnswer);
            answerButtonsEl.appendChild(button);
        });

        // Atualiza a barra de progresso
        const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
        progressTextEl.textContent = `Pergunta ${currentQuestionIndex + 1} de ${allQuestions.length}`;
        progressBarEl.style.width = `${progress}%`;
    }

    /**
     * Limpa o estado anterior (respostas, feedback)
     */
    function resetState() {
        nextBtn.style.display = 'none';
        feedbackTextEl.textContent = '';
        feedbackTextEl.classList.remove('correct', 'incorrect');
        
        while (answerButtonsEl.firstChild) {
            answerButtonsEl.removeChild(answerButtonsEl.firstChild);
        }
    }

    /**
     * Chamada quando o utilizador clica numa resposta
     */
    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';

        if (isCorrect) {
            selectedBtn.classList.add('correct');
            feedbackTextEl.textContent = 'Resposta Correta!';
            feedbackTextEl.classList.add('correct');
            score++;
        } else {
            selectedBtn.classList.add('incorrect');
            feedbackTextEl.textContent = 'Resposta Incorreta!';
            feedbackTextEl.classList.add('incorrect');
        }

        // Mostra a resposta correta e desativa todos os botões
        Array.from(answerButtonsEl.children).forEach(button => {
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
            button.disabled = true;
        });

        // Mostra o botão "Próximo"
        nextBtn.style.display = 'block';
    }

    /**
     * Mostra os resultados finais
     */
    function showResults() {
        // Esconde o quiz
        quizHeaderEl.style.display = 'none';
        questionContainerEl.style.display = 'none';
        controlsEl.style.display = 'none';

        // Mostra os resultados
        resultsContainerEl.style.display = 'block';

        const percentage = Math.round((score / allQuestions.length) * 100);

        scoreTextEl.textContent = `Sua pontuação: ${score} de ${allQuestions.length}`;
        scorePercentageEl.textContent = `${percentage}%`;

        // Feedback e ícone com base na pontuação
        if (percentage >= 80) {
            scoreFeedbackEl.textContent = 'Excelente trabalho! Você domina este EPI.';
            scorePercentageEl.style.color = '#27ae60'; // Verde
            resultsIconEl.className = 'bx bxs-trophy';
            resultsIconEl.style.color = '#ffc107'; // Amarelo
        } else if (percentage >= 50) {
            scoreFeedbackEl.textContent = 'Bom esforço! Reveja a aula para fixar os pontos restantes.';
            scorePercentageEl.style.color = '#f39c12'; // Laranja
            resultsIconEl.className = 'bx bxs-check-shield';
            resultsIconEl.style.color = '#1ba8d4'; // Azul
        } else {
            scoreFeedbackEl.textContent = 'Parece que precisa de rever a aula. Tente novamente!';
            scorePercentageEl.style.color = '#e74c3c'; // Vermelho
            resultsIconEl.className = 'bx bxs-book-open';
            resultsIconEl.style.color = '#e74c3c'; // Vermelho
        }

        // Atualiza o botão de reiniciar
        restartBtn.href = `quiz.html?aula=${currentQuizName}`;
    }

    /**
     * Trata do clique no botão "Próxima Pergunta"
     */
    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < allQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    // --- 4. Adicionar Event Listeners ---
    nextBtn.addEventListener('click', handleNextButton);
    // O botão de reiniciar funciona com o href, não precisa de listener.

    // --- 5. Iniciar o Quiz ---
    loadQuiz();
});