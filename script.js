document.addEventListener('DOMContentLoaded', () => {
    const cryptoList = document.getElementById('crypto-list');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
 
    let allCryptos = [];
 
    const fetchData = (days = 1) => {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&days=${days}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                allCryptos = data;
                displayCryptos(allCryptos);
            })
            .catch(error => console.error('Error fetching data:', error));
    };
 
    const displayCryptos = (cryptos) => {
        cryptoList.innerHTML = '';
        cryptos.forEach(crypto => {
            const cryptoCard = document.createElement('div');
            cryptoCard.classList.add('crypto-card');
 
            const priceChangeClass = crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative';
            const marketCap = (crypto.market_cap / 1e9).toFixed(1) + 'B';
 
            cryptoCard.innerHTML = `
                <div class="name">
                    <img src="${crypto.image}" alt="${crypto.name}">
                    <h2>${crypto.name}</h2>
                    <p> (${crypto.symbol.toUpperCase()})</p>
                </div>
                <div class="price">$${crypto.current_price.toFixed(2)}</div>
                <div>
                    <canvas id="chart-${crypto.id}"></canvas>
                </div>
                <div class="price-change ${priceChangeClass}">${crypto.price_change_percentage_24h.toFixed(2)}%</div>
                <div class="market-cap">$${marketCap}</div>
                <div><button class="trade-button">Trade</button></div>
            `;
 
            cryptoList.appendChild(cryptoCard);
 
            const ctx = document.getElementById(`chart-${crypto.id}`).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: crypto.sparkline_in_7d.price.map((_, index) => index),
                    datasets: [{
                        data: crypto.sparkline_in_7d.price,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    }
                }
            });
        });
    };
 
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCryptos = allCryptos.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm) ||
            crypto.symbol.toLowerCase().includes(searchTerm)
        );
        displayCryptos(filteredCryptos);
    });
 
    filterSelect.addEventListener('change', (e) => {
        const days = parseInt(e.target.value); // Convert selected value to integer
        fetchData(days);
    });
 
    // Fetch initial data for 1 day
    fetchData(); // This fetches data for 1 day initially
});
 
 