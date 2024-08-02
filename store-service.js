const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

module.exports.initialize = function() 
{
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8', (err, data) => {
            if (err) 
            {
                reject('unable to read the file items.json');
            } else 
            {
                items = JSON.parse(data);
                fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
                    if (err) 
                    {
                        reject('unable to read the file categories.json');
                    } else 
                    {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
};

module.exports.getAllItems = function() 
{
    return new Promise((resolve, reject) => {
        if (items.length === 0) 
        {
            reject('results not returned');
        } else 
        {
            resolve(items);
        }
    });
};

module.exports.getPublishedItems = function() 
{
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length === 0) 
        {
            reject('results not returned');
        } else 
        {
            resolve(publishedItems);
        }
    });
};

module.exports.getPublishedItemsByCategory = function(category) 
{
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true && item.category == category);
        if (publishedItems.length === 0) 
        {
            reject('results not returned');
        } else 
        {
            resolve(publishedItems);
        }
    });
};

module.exports.getCategories = function() 
{
    return new Promise((resolve, reject) => {
        if (categories.length === 0) 
        {
            reject('results not returned');
        } else 
        {
            resolve(categories);
        }
    });
};

module.exports.addItem = function(itemData) 
{
    return new Promise((resolve, reject) => {
        if (itemData.published === undefined) 
        {
            itemData.published = false;
        } else 
        {
            itemData.published = true;
        }
        itemData.id = items.length + 1;
        itemData.itemDate = new Date().toISOString().split('T')[0];
        items.push(itemData);
        resolve(itemData);
    });
};

module.exports.getItemsByCategory = function(category) 
{
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => item.category == category);
        if (filteredItems.length === 0) 
        {
            reject('results not returned');
        } else 
        {
            resolve(filteredItems);
        }
    });
};

module.exports.getItemsByMinDate = function(minDateStr) 
{
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => new Date(item.itemDate) >= new Date(minDateStr));
        if (filteredItems.length === 0) 
        {
            reject('results not returned');
        } else 
        {
            resolve(filteredItems);
        }
    });
};

module.exports.getItemById = function(id) 
{
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id == id);
        if (item) 
        {
            resolve(item);
        } else 
        {
            reject('results not returned');
        }
    });
};