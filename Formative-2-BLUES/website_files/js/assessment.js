/* =========================================================
   SOFTWARE EXPLORER - ASSESSMENT / QUIZ ENGINE
   Renders 10 quiz questions one at a time, runs a countdown
   timer, tracks a custom progress indicator, supports image
   hotspot / audio / video interactive questions, and scores
   the student across four specialisation categories with a
   speed / streak bonus multiplier.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    const quizForm = document.getElementById('quiz-form');
    if (!quizForm) return; // Safety check: only run on the assessment page.

    /* ---------------------------------------------------
       1. QUESTION BANK
       Ten questions covering the four specialisations:
       lowlevel, arvr, fullstack, ml.
       Types: "mcq" (standard multiple choice), "hotspot"
       (click a region of an image), "audio" and "video"
       (interactive media questions).
       --------------------------------------------------- */
    const questions = [
        {
            id: 'q1',
            type: 'mcq',
            tag: 'Interests',
            text: 'Which activity interests you the most?',
            options: [
                { label: 'Understanding how computers work at a low level', value: 'lowlevel' },
                { label: 'Creating immersive virtual experiences', value: 'arvr' },
                { label: 'Building websites and web apps', value: 'fullstack' },
                { label: 'Working with data and artificial intelligence', value: 'ml' }
            ]
        },
        {
            id: 'q2',
            type: 'mcq',
            tag: 'Problem Solving',
            text: 'Which type of problem would you most enjoy solving?',
            options: [
                { label: 'Optimising memory usage in an operating system', value: 'lowlevel' },
                { label: 'Making a virtual environment feel realistic', value: 'arvr' },
                { label: 'Connecting a front-end to a working back-end API', value: 'fullstack' },
                { label: 'Improving the accuracy of a prediction model', value: 'ml' }
            ]
        },
        {
            id: 'q3',
            type: 'mcq',
            tag: 'Projects',
            text: 'Which project would you love to build first?',
            options: [
                { label: 'A small compiler or embedded systems tool', value: 'lowlevel' },
                { label: 'A VR training simulation', value: 'arvr' },
                { label: 'A full online store with a database', value: 'fullstack' },
                { label: 'A chatbot trained on real data', value: 'ml' }
            ]
        },
        {
            id: 'q4',
            type: 'hotspot',
            tag: 'Interactive: Image Hotspot',
            text: 'Click the card that matches what interests you most.',
            regions: [
                { label: 'Low-Level Programming', value: 'lowlevel', left: 10.5, top: 4.5, width: 21, height: 29 },
                { label: 'Full-Stack Web Development', value: 'fullstack', left: 67, top: 4.5, width: 19, height: 29 },
                { label: 'AR / VR Development', value: 'arvr', left: 10, top: 35.5, width: 20, height: 29 },
                { label: 'Machine Learning', value: 'ml', left: 68.5, top: 35.5, width: 19, height: 29 }
            ]
        },
        {
            id: 'q5',
            type: 'mcq',
            tag: 'Tools',
            text: 'Which tool or technology excites you the most?',
            options: [
                { label: 'C / C++ and hardware debuggers', value: 'lowlevel' },
                { label: 'Unity, Unreal Engine or WebXR', value: 'arvr' },
                { label: 'React, Node.js and databases', value: 'fullstack' },
                { label: 'Python, TensorFlow or PyTorch', value: 'ml' }
            ]
        },
        {
            id: 'q6',
            type: 'mcq',
            tag: 'Work Style',
            text: 'What is your ideal day-to-day work like?',
            options: [
                { label: 'Digging deep into how systems work under the hood', value: 'lowlevel' },
                { label: 'Designing interactive, visual experiences', value: 'arvr' },
                { label: 'Shipping features end-to-end, from UI to server', value: 'fullstack' },
                { label: 'Analysing data and training models', value: 'ml' }
            ]
        },
        {
            id: 'q7',
            type: 'audio',
            tag: 'Interactive: Audio Scenario',
            text: 'Listen to the scenario, then choose the specialisation that fits it best.',
            fallbackText: 'Scenario: "A hospital needs a system that can quickly flag unusual patterns in patient scans." Which specialisation would you choose to solve this?',
            options: [
                { label: 'Low-Level Programming', value: 'lowlevel' },
                { label: 'AR/VR', value: 'arvr' },
                { label: 'Full-Stack Development', value: 'fullstack' },
                { label: 'Machine Learning', value: 'ml' }
            ]
        },
        {
            id: 'q8',
            type: 'mcq',
            tag: 'Skills',
            text: 'Which skill would you like to master next?',
            options: [
                { label: 'Memory management and systems programming', value: 'lowlevel' },
                { label: '3D modelling and spatial interaction design', value: 'arvr' },
                { label: 'API design and database architecture', value: 'fullstack' },
                { label: 'Statistics and machine learning algorithms', value: 'ml' }
            ]
        },
        {
            id: 'q9',
            type: 'video',
            tag: 'Interactive: Video Scenario',
            text: 'Watch the short scenario clip, then choose the specialisation that interests you most.',
            fallbackText: 'Scenario: "A retail company wants an app their staff can use to see products overlaid in the real store using their phone camera." Which specialisation would you choose?',
            pauseAt: 4,
            options: [
                { label: 'Low-Level Programming', value: 'lowlevel' },
                { label: 'AR/VR', value: 'arvr' },
                { label: 'Full-Stack Development', value: 'fullstack' },
                { label: 'Machine Learning', value: 'ml' }
            ]
        },
        {
            id: 'q10',
            type: 'mcq',
            tag: 'Future Goals',
            text: 'Where do you see yourself in five years?',
            options: [
                { label: 'Working on operating systems or firmware', value: 'lowlevel' },
                { label: 'Building next-generation immersive products', value: 'arvr' },
                { label: 'Leading full-stack product development', value: 'fullstack' },
                { label: 'Researching or applying machine learning', value: 'ml' }
            ]
        }
    ];

    const categoryLabels = {
        lowlevel: 'Low-Level Programming',
        arvr: 'AR/VR',
        fullstack: 'Full-Stack Development',
        ml: 'Machine Learning'
    };

    /* ---------------------------------------------------
       2. STATE
       --------------------------------------------------- */
    let currentIndex = 0;
    const answers = {};              // { questionId: category }
    const answerTimestamps = {};     // { questionId: msElapsedWhenAnswered }
    let questionShownAt = performance.now();
    let streak = 0;                  // consecutive quick answers
    let quizLocked = false;

    const TOTAL_SECONDS = 360; // 6 minute overall countdown for the quiz
    const FAST_ANSWER_THRESHOLD_MS = 8000; // answers under 8s count as "fast"
    let secondsRemaining = TOTAL_SECONDS;
    let timerInterval = null;

    const questionsContainer = document.getElementById('questions-container');
    const progressFill = document.getElementById('progress-fill');
    const progressLabel = document.getElementById('progress-label');
    const timerEl = document.getElementById('timer');
    const timeoutBanner = document.getElementById('timeout-banner');
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const submitBtn = document.getElementById('submit-assessment');

    /* ---------------------------------------------------
       3. RENDER QUESTIONS
       Each question type builds its own markup, but they
       all share the same .question card wrapper so the
       styling and show/hide logic stays consistent.
       --------------------------------------------------- */
    function buildOptionsList(question) {
        const wrapper = document.createElement('div');
        wrapper.className = 'options-list';

        question.options.forEach(function (opt, i) {
            const label = document.createElement('label');
            label.className = 'option-label';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = question.id;
            input.value = opt.value;
            input.id = question.id + '-opt' + i;

            input.addEventListener('change', function () {
                selectAnswer(question.id, opt.value, label, wrapper);
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(opt.label));
            wrapper.appendChild(label);
        });

        return wrapper;
    }

    function selectAnswer(questionId, value, label, wrapper) {
        // Highlight the chosen option and clear highlighting on siblings.
        wrapper.querySelectorAll('.option-label').forEach(function (el) {
            el.classList.remove('selected');
        });
        label.classList.add('selected');

        recordAnswer(questionId, value);
    }

    function recordAnswer(questionId, value) {
        answers[questionId] = value;

        // Work out how quickly the student answered, for the
        // streak / speed bonus in the scoring engine.
        const elapsed = performance.now() - questionShownAt;
        answerTimestamps[questionId] = elapsed;

        updateNavState();
    }

    function renderQuestion(question, index) {
        const section = document.createElement('section');
        section.className = 'question';
        section.id = 'question-' + question.id;
        section.dataset.index = String(index);
        if (index !== currentIndex) section.hidden = true;

        const tag = document.createElement('span');
        tag.className = 'question-tag';
        tag.textContent = question.tag;
        section.appendChild(tag);

        const heading = document.createElement('h3');
        heading.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;
        section.appendChild(heading);

        const prompt = document.createElement('p');
        prompt.textContent = question.text;
        section.appendChild(prompt);

        if (question.type === 'mcq') {
            section.appendChild(buildOptionsList(question));

        } else if (question.type === 'hotspot') {
            section.appendChild(buildHotspot(question));

        } else if (question.type === 'audio') {
            section.appendChild(buildAudioQuestion(question));

        } else if (question.type === 'video') {
            section.appendChild(buildVideoQuestion(question));
        }

        return section;
    }

    /* ---- Image hotspot question ---- */
    function buildHotspot(question) {
        const container = document.createElement('div');

        const imageWrap = document.createElement('div');
        imageWrap.className = 'image-hotspot';

        const img = document.createElement('img');
        img.src = 'images/confused-student.jpg';
        img.alt = 'Four specialisation cards: Low-Level Programming, AR/VR, Full-Stack Web Development and Machine Learning';
        imageWrap.appendChild(img);

        question.regions.forEach(function (region) {
            const hotspot = document.createElement('button');
            hotspot.type = 'button';
            hotspot.className = 'hotspot';
            hotspot.setAttribute('aria-label', region.label);
            hotspot.style.left = region.left + '%';
            hotspot.style.top = region.top + '%';
            hotspot.style.width = region.width + '%';
            hotspot.style.height = region.height + '%';

            hotspot.addEventListener('click', function () {
                imageWrap.querySelectorAll('.hotspot').forEach(function (h) {
                    h.classList.remove('selected');
                });
                hotspot.classList.add('selected');
                feedback.textContent = 'Selected: ' + region.label;
                recordAnswer(question.id, region.value);
            });

            imageWrap.appendChild(hotspot);
        });

        container.appendChild(imageWrap);

        const feedback = document.createElement('p');
        feedback.id = 'hotspot-feedback';
        feedback.textContent = 'Click on a card above to select your answer.';
        container.appendChild(feedback);

        return container;
    }

    /* ---- Audio scenario question ---- */
    function buildAudioQuestion(question) {
        const container = document.createElement('div');

        const audio = document.createElement('audio');
        audio.id = question.id + '-audio';
        // preload metadata only; the file may not exist yet in
        // every deployment, so we handle that with a fallback.
        audio.preload = 'metadata';

        const source = document.createElement('source');
        source.src = 'audio/scenario.mp3';
        source.type = 'audio/mpeg';
        audio.appendChild(source);
        container.appendChild(audio);

        const fallback = document.createElement('div');
        fallback.className = 'media-fallback';
        fallback.textContent = question.fallbackText;
        container.appendChild(fallback);

        // Custom play / pause / replay controls, per the
        // assessment's "custom JS control events" requirement.
        const controls = document.createElement('div');
        controls.className = 'media-controls';

        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.textContent = 'Play';

        const pauseBtn = document.createElement('button');
        pauseBtn.type = 'button';
        pauseBtn.textContent = 'Pause';

        const replayBtn = document.createElement('button');
        replayBtn.type = 'button';
        replayBtn.textContent = 'Replay';

        playBtn.addEventListener('click', function () { audio.play().catch(function () {}); });
        pauseBtn.addEventListener('click', function () { audio.pause(); });
        replayBtn.addEventListener('click', function () {
            audio.currentTime = 0;
            audio.play().catch(function () {});
        });

        controls.appendChild(playBtn);
        controls.appendChild(pauseBtn);
        controls.appendChild(replayBtn);
        container.appendChild(controls);

        // If the audio file cannot be loaded, hide the player and
        // show the text fallback so the question is still answerable.
        audio.addEventListener('error', function () {
            audio.style.display = 'none';
            controls.style.display = 'none';
            fallback.classList.add('visible');
        });

        container.appendChild(buildOptionsList(question));
        return container;
    }

    /* ---- Video scenario question ---- */
    function buildVideoQuestion(question) {
        const container = document.createElement('div');

        const video = document.createElement('video');
        video.id = question.id + '-video';
        video.controls = true;
        video.preload = 'metadata';

        const source = document.createElement('source');
        source.src = 'videos/scenario.mp4';
        source.type = 'video/mp4';
        video.appendChild(source);
        container.appendChild(video);

        const checkpoint = document.createElement('div');
        checkpoint.className = 'video-checkpoint';
        checkpoint.textContent = 'Paused at the checkpoint - take a moment to think about your answer, then press play to continue.';
        container.appendChild(checkpoint);

        const fallback = document.createElement('div');
        fallback.className = 'media-fallback';
        fallback.textContent = question.fallbackText;
        container.appendChild(fallback);

        // Automatically pause once at the pre-programmed timestamp
        // using the timeupdate event, then show a checkpoint prompt.
        let hasPaused = false;
        video.addEventListener('timeupdate', function () {
            if (!hasPaused && video.currentTime >= question.pauseAt) {
                video.pause();
                hasPaused = true;
                checkpoint.classList.add('visible');
            }
        });
        video.addEventListener('play', function () {
            checkpoint.classList.remove('visible');
        });

        // If the video file cannot be loaded, hide the player and
        // show the text fallback so the question is still answerable.
        video.addEventListener('error', function () {
            video.style.display = 'none';
            fallback.classList.add('visible');
        });

        container.appendChild(buildOptionsList(question));
        return container;
    }

    // Build and insert every question up front; visibility is
    // then toggled as the student moves through the quiz.
    questions.forEach(function (question, index) {
        questionsContainer.appendChild(renderQuestion(question, index));
    });

    /* ---------------------------------------------------
       4. NAVIGATION BETWEEN QUESTIONS
       --------------------------------------------------- */
    function showQuestion(index) {
        document.querySelectorAll('.question').forEach(function (section) {
            section.hidden = Number(section.dataset.index) !== index;
        });

        currentIndex = index;
        questionShownAt = performance.now();

        progressFill.style.width = (((index + 1) / questions.length) * 100) + '%';
        progressLabel.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;

        prevBtn.disabled = index === 0;
        const isLast = index === questions.length - 1;
        nextBtn.hidden = isLast;
        submitBtn.hidden = !isLast;

        updateNavState();
    }

    function updateNavState() {
        const answered = Boolean(answers[questions[currentIndex].id]);
        nextBtn.disabled = !answered;
        submitBtn.disabled = !answered;
    }

    prevBtn.addEventListener('click', function () {
        if (currentIndex > 0) showQuestion(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function () {
        if (currentIndex < questions.length - 1) showQuestion(currentIndex + 1);
    });

    /* ---------------------------------------------------
       5. COUNTDOWN TIMER + TIMEOUT HANDLING
       --------------------------------------------------- */
    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return m + ':' + s;
    }

    function tick() {
        secondsRemaining -= 1;
        timerEl.textContent = formatTime(Math.max(secondsRemaining, 0));

        if (secondsRemaining <= 30) {
            timerEl.classList.add('timer-warning');
        }

        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }

    function startTimer() {
        timerEl.textContent = formatTime(secondsRemaining);
        timerInterval = setInterval(tick, 1000);
    }

    function handleTimeout() {
        quizLocked = true;
        document.body.classList.add('quiz-locked');
        timeoutBanner.classList.add('visible');
        submitAssessment(); // auto-submit whatever was answered so far
    }

    /* ---------------------------------------------------
       6. SCORING ENGINE
       Tallies one point per answered question into its
       category, plus a speed bonus for quick answers. A
       running streak of fast answers increases the bonus,
       rewarding consistently quick decision-making.
       --------------------------------------------------- */
    function calculateScores() {
        const scores = { lowlevel: 0, arvr: 0, fullstack: 0, ml: 0 };
        streak = 0;

        questions.forEach(function (question) {
            const answer = answers[question.id];
            if (!answer) return;

            scores[answer] += 1;

            const elapsed = answerTimestamps[question.id] || Infinity;
            if (elapsed <= FAST_ANSWER_THRESHOLD_MS) {
                streak += 1;
                // Streak multiplier: every fast answer adds a bonus,
                // and the bonus itself grows the longer the streak.
                const bonus = 0.5 + (Math.min(streak, 5) - 1) * 0.1;
                scores[answer] += bonus;
            } else {
                streak = 0;
            }
        });

        const total = Object.values(scores).reduce(function (a, b) { return a + b; }, 0) || 1;
        const percentages = {};
        Object.keys(scores).forEach(function (key) {
            percentages[key] = Math.round((scores[key] / total) * 100);
        });

        return { scores: scores, percentages: percentages, total: total };
    }

    function getRecommendation(percentages) {
        let topKey = 'fullstack';
        let topValue = -1;
        Object.keys(percentages).forEach(function (key) {
            if (percentages[key] > topValue) {
                topValue = percentages[key];
                topKey = key;
            }
        });
        return topKey;
    }

    /* ---------------------------------------------------
       7. SUBMIT
       --------------------------------------------------- */
    let alreadySubmitted = false;

    function submitAssessment() {
        if (alreadySubmitted) return;
        alreadySubmitted = true;

        clearInterval(timerInterval);

        const result = calculateScores();
        const recommendation = getRecommendation(result.percentages);

        const resultsPayload = {
            scores: result.scores,
            percentages: result.percentages,
            recommendation: recommendation,
            recommendationLabel: categoryLabels[recommendation],
            answeredCount: Object.keys(answers).length,
            totalQuestions: questions.length,
            timeUsedSeconds: TOTAL_SECONDS - Math.max(secondsRemaining, 0)
        };

        localStorage.setItem('softwareExplorerResults', JSON.stringify(resultsPayload));
        window.location.href = 'results.html';
    }

    quizForm.addEventListener('submit', function (event) {
        event.preventDefault();
        submitAssessment();
    });

    /* ---------------------------------------------------
       8. INITIALISE
       --------------------------------------------------- */
    showQuestion(0);
    startTimer();

});
