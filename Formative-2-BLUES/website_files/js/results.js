/* =========================================================
   SOFTWARE EXPLORER - RESULTS PAGE
   Reads the quiz results saved to localStorage, displays the
   recommendation and score breakdown, and draws a radar
   (spider) chart on an HTML5 Canvas using the raw 2D API -
   no external charting libraries.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    const canvas = document.getElementById('results-chart');
    if (!canvas) return; // Safety check: only run on the results page.

    const categoryLabels = {
        lowlevel: 'Low-Level Programming',
        arvr: 'AR/VR',
        fullstack: 'Full-Stack Development',
        ml: 'Machine Learning'
    };

    const categoryBlurbs = {
        lowlevel: 'You think in systems and detail. Low-Level Programming will let you work close to the hardware, mastering memory, performance and operating systems.',
        arvr: 'You are drawn to immersive, visual experiences. AR/VR will let you design worlds and interactions people can step into.',
        fullstack: 'You like building complete, usable products. Full-Stack Development will let you own everything from the interface to the database.',
        ml: 'You are curious about patterns in data. Machine Learning will let you build systems that learn and improve from experience.'
    };

    /* ---------------------------------------------------
       1. LOAD SAVED RESULTS
       Falls back to a neutral demo state if a visitor opens
       this page directly, without having taken the quiz.
       --------------------------------------------------- */
    const raw = localStorage.getItem('softwareExplorerResults');
    const results = raw ? JSON.parse(raw) : {
        percentages: { lowlevel: 25, arvr: 25, fullstack: 25, ml: 25 },
        recommendation: 'fullstack',
        recommendationLabel: 'Full-Stack Development',
        answeredCount: 0,
        totalQuestions: 10
    };

    const studentRaw = localStorage.getItem('softwareExplorerStudent');
    const student = studentRaw ? JSON.parse(studentRaw) : null;

    /* ---------------------------------------------------
       2. RECOMMENDATION TEXT
       --------------------------------------------------- */
    const recommendationEl = document.getElementById('recommendation');
    const recommendationTextEl = document.getElementById('recommendation-text');
    const greetingEl = document.getElementById('result-greeting');

    if (recommendationEl) {
        recommendationEl.textContent = results.recommendationLabel;
    }
    if (recommendationTextEl) {
        recommendationTextEl.textContent = categoryBlurbs[results.recommendation] || '';
    }
    if (greetingEl && student && student.name) {
        greetingEl.textContent = 'Great work, ' + student.name.split(' ')[0] + '!';
    }

    /* ---------------------------------------------------
       3. SCORE BREAKDOWN BARS
       --------------------------------------------------- */
    Object.keys(categoryLabels).forEach(function (key) {
        const valueEl = document.getElementById(key + '-score');
        const barEl = document.getElementById(key + '-bar');
        const pct = results.percentages[key] || 0;

        if (valueEl) valueEl.textContent = pct + '%';
        if (barEl) {
            // Animate the bar filling in shortly after page load.
            requestAnimationFrame(function () {
                barEl.style.width = pct + '%';
            });
        }
    });

    /* ---------------------------------------------------
       4. RADAR / SPIDER CHART (pure Canvas 2D API)
       Plots the four category percentages as a four-point
       radar chart, with grid rings, axis labels and a
       filled polygon representing the student's profile.
       --------------------------------------------------- */
    const ctx = canvas.getContext('2d');
    const categories = ['lowlevel', 'arvr', 'fullstack', 'ml'];
    const shortLabels = { lowlevel: 'Low-Level', arvr: 'AR/VR', fullstack: 'Full-Stack', ml: 'ML' };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 10;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 60;
    const sides = categories.length;
    const ringLevels = 4; // number of concentric grid rings

    // Purple/orange theme colours to match the rest of the site.
    const gridColor = '#e7e1f7';
    const axisColor = '#c9c3da';
    const fillColor = 'rgba(109, 40, 217, 0.28)';
    const strokeColor = '#6d28d9';
    const pointColor = '#ea580c';
    const labelColor = '#211236';

    // Converts a category index into an (x, y) point on the
    // circle, given a 0-1 value for how far out to plot it.
    function pointFor(index, value) {
        const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
        const radius = value * maxRadius;
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Concentric rings.
        for (let ring = 1; ring <= ringLevels; ring++) {
            const ringValue = ring / ringLevels;
            ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const p = pointFor(i % sides, ringValue);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Axis lines from the centre to each category.
        for (let i = 0; i < sides; i++) {
            const p = pointFor(i, 1);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = axisColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Category labels around the outside of the chart.
        ctx.fillStyle = labelColor;
        ctx.font = '600 14px Poppins, Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < sides; i++) {
            const p = pointFor(i, 1.18);
            ctx.fillText(shortLabels[categories[i]], p.x, p.y);
        }
    }

    function drawDataPolygon() {
        ctx.beginPath();
        categories.forEach(function (key, i) {
            const value = (results.percentages[key] || 0) / 100;
            const p = pointFor(i, value);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw a point + percentage label at each vertex.
        categories.forEach(function (key, i) {
            const value = (results.percentages[key] || 0) / 100;
            const p = pointFor(i, value);

            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = pointColor;
            ctx.fill();

            ctx.fillStyle = labelColor;
            ctx.font = '700 12px Inter, Arial, sans-serif';
            ctx.fillText((results.percentages[key] || 0) + '%', p.x, p.y - 14);
        });
    }

    function renderChart() {
        drawGrid();
        drawDataPolygon();
    }

    renderChart();

    // Redraw if the canvas is resized responsively (e.g. on
    // orientation change), keeping the chart crisp.
    window.addEventListener('resize', function () {
        renderChart();
    });

    /* ---------------------------------------------------
       5. RETAKE ASSESSMENT
       --------------------------------------------------- */
    const retakeBtn = document.getElementById('retake-button');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', function () {
            localStorage.removeItem('softwareExplorerResults');
            window.location.href = 'assessment.html';
        });
    }

});
