const coin = document.getElementById('coin');
const flipButton = document.getElementById('flip-button');
const result = document.getElementById('result');

flipButton.addEventListener('click', flipCoin);

function flipCoin() {
    // Disable button during animation
    flipButton.disabled = true;
    result.textContent = '';
    
    // Remove previous animation class
    coin.classList.remove('animate-flip');
    
    // Trigger reflow to restart animation
    void coin.offsetWidth;
    
    // Add animation class
    coin.classList.add('animate-flip');
    
    // Generate random result
    const random = Math.random();
    const outcome = random < 0.5 ? 'Head' : 'Tail';
    
    // Update result after animation
    setTimeout(() => {
        result.textContent = outcome + '!';
        flipButton.disabled = false;
        
        // Set final rotation based on outcome
        coin.style.transform = `rotateY(${outcome === 'Head' ? '720deg' : '900deg'})`;
    }, 1000);
}
