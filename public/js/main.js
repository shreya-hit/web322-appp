document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname === '/items') {
        fetch('/items-data')
            .then(response => response.json())
            .then(data => {
                const itemsContainer = document.getElementById('items-container');
                data.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('item', 'card', 'mb-3');

                    itemElement.innerHTML = `
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${item.featureImage}" class="card-img" alt="${item.title}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.body}</p>
                                    <p class="card-text"><small class="text-muted">Price: $${item.price}</small></p>
                                </div>
                            </div>
                        </div>
                    `;

                    itemsContainer.appendChild(itemElement);
                });
            })
            .catch(error => console.error('Items not Fetched:', error));
    } else if (window.location.pathname === '/categories') {
        fetch('/categories-data')
            .then(response => response.json())
            .then(data => {
                const categoriesContainer = document.getElementById('categories-container');
                data.forEach(category => {
                    const categoryElement = document.createElement('div');
                    categoryElement.classList.add('category', 'card', 'mb-3');

                    categoryElement.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${category.category}</h5>
                        </div>
                    `;

                    categoriesContainer.appendChild(categoryElement);
                });
            })
            .catch(error => console.error('Categories items not fetched:', error));
    } else if (window.location.pathname === '/shop') {
        fetch('/shop-data')
            .then(response => response.json())
            .then(data => {
                const shopContainer = document.getElementById('shop-container');
                data.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('item', 'card', 'mb-3');

                    itemElement.innerHTML = `
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${item.featureImage}" class="card-img" alt="${item.title}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.body}</p>
                                    <p class="card-text"><small class="text-muted">Price: $${item.price}</small></p>
                                </div>
                            </div>
                        </div>
                    `;

                    shopContainer.appendChild(itemElement);
                });
            })
            .catch(error => console.error('Shop items not fetched:', error));
    }
});