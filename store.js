if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}
else{
    ready()
}


function ready(){
    if (document.querySelector('.cart-items')){
        getCartItemsFromLocalStorage()
        
    
        //Cart Address
        document.getElementById("address-submit").addEventListener('click',enterAddress)
        document.getElementById('address-edit').addEventListener('click',editAddress)
    
        //Cart Remove
        let removeItemCartButton = document.getElementsByClassName('item-remove')
        // console.log(removeItemCartButton)
        for(var i=0;i<removeItemCartButton.length;i++){
            var button = removeItemCartButton[i]
            button.addEventListener('click',removeCartItem)
        }
    
        //Change cart quantity
        let quantityInputs= document.getElementsByClassName('item-quantity')
        for(var i=0;i<quantityInputs.length;i++){
            var input = quantityInputs[i]
            input.addEventListener('change',quantityChanged)
        }
    
     
    
    }
    else if(document.querySelector('.store-items')){

        let addToCartButtons=document.getElementsByClassName('item-addtocart')
        for(var i=0;i<addToCartButtons.length;i++){
            var addCart = addToCartButtons[i]
            addCart.addEventListener('click',addToCartClicked)
        }
    }
 
    
}

function addToCartClicked(event){
    let addCart=event.target
    let shopItem = addCart.parentElement
    let titleItem= shopItem.getElementsByClassName('item-title')[0].innerText
    let priceItem=shopItem.getElementsByClassName('item-price')[0].innerText
    let imageItemSource =shopItem.getElementsByClassName('item-image')[0].src
    // console.log(titleItem, priceItem, imageItemSource)
    addItemToCart(titleItem, priceItem, imageItemSource)
    
    
}

function addItemToCart(titleItem, priceItem, imageItemSource){
    let localCartItems=JSON.parse(localStorage.getItem("cartItems"))||[]
    for (var i=0;i<localCartItems.length;i++){
        if (localCartItems[i].title==titleItem){
            alert("Already added to cart")
            return
        }
    }
    let localCartItem={title: titleItem, price: priceItem, imgsrc : imageItemSource,noOfItems:1}
    localCartItems.push(localCartItem)
    localStorage.setItem('cartItems',JSON.stringify(localCartItems))
    
}

function getCartItemsFromLocalStorage(){
    
    let CartItems=JSON.parse(localStorage.getItem('cartItems'))||[]
    let cartItemsContainer = document.getElementsByClassName('cart-items')[0];
    CartItems.forEach(item => {
        let newCartRow = document.createElement('div')
        newCartRow.classList.add('cart-items-item')
        let newCartContents = `
            
                    <div class="cart-image">
                        <img src="${item.imgsrc}" alt="">
                    </div>
                    <div class="cart-item-details">
                        <span class="item-title">${item.title}</span>
                        <span class="item-price">${item.price}</span>
                    </div>
                    
                    <input type="number" value="${item.noOfItems}" class="item-quantity">
                    <button class="item-remove" id="removeButton">Remove</button>
            
    `;
    newCartRow.innerHTML=newCartContents
    cartItemsContainer.append(newCartRow);
    });
    updateCartTotal() //updates the total amount
}


function quantityChanged(event){
    let input = event.target
    console.log(input)
    if (isNaN(input.value) || input.value<=0){
        input.value=1
    }
    else if (isNaN(input.value) || input.value>=20){
        input.value=20
        alert('Maximum quantity should be less than 20')
    }
    
    

    updateQuantityInLocalStorage(input)
    updateCartTotal()
}

function updateQuantityInLocalStorage(input){
    let cartItem =input.parentElement
    let title=cartItem.getElementsByClassName('item-title')[0].innerText
    let cartItems=JSON.parse(localStorage.getItem('cartItems'))||[]

    for(let i=0;i<cartItems.length;i++){
        if(cartItems[i].title===title){
            cartItems[i].noOfItems=parseInt(input.value)
            break
        }
    }
    localStorage.setItem('cartItems',JSON.stringify(cartItems))
}

function enterAddress(){
    let address= document.getElementById('address-input').value
    if (address.trim()!=''){
        document.getElementById("address-input").classList.add('hidden')
        document.getElementById("address-submit").classList.add('hidden')

        var addressDisplay = document.getElementById("address-display")
        addressDisplay.textContent= 'Your item will be delivered to '+address
        addressDisplay.classList.remove('hidden')

        document.getElementById('address-edit').classList.remove('hidden')
        }
    else{
        alert('Please enter an address')
    }
}

function editAddress(){
    address= document.getElementById('address-input').value
    document.getElementById("address-input").classList.remove('hidden')
    document.getElementById("address-submit").classList.remove('hidden')

    document.getElementById("address-display").classList.add('hidden')
    document.getElementById("address-edit").classList.add('hidden')

    document.getElementById('address-input').value = address;  
}

function updateCartTotal(){
    let cartItems=document.getElementsByClassName("cart-items")[0]
    let cartItemsItem=document.getElementsByClassName("cart-items-item")

    // console.log(cartItemsItem)
    let total =0
    for (var i=0;i<cartItemsItem.length;i++){
        let CartItem=cartItemsItem[i]
        let priceElement=CartItem.getElementsByClassName("item-price")[0]
        let quantityElement = CartItem.getElementsByClassName("item-quantity")[0]
        
        if(priceElement && quantityElement){
            let price=parseFloat(priceElement.innerText.replace("₹",'').replace(",",''))
            let quantity=parseFloat(quantityElement.value)
            // console.log(price,quantity)
            total+=price*quantity
        }
      
       

    }
    total = Math.round(total*100)/100
    document.getElementById('totalAmt').innerText='₹'+total
}

function removeCartItem(event){
    var buttonClicked = event.target
    console.log(buttonClicked.parentElement)
    buttonClicked.parentElement.remove()
    removeCartItemFromLocalStorage(buttonClicked)
    updateCartTotal()
}

function removeCartItemFromLocalStorage(buttonClicked){
    let cartItem =buttonClicked.parentElement
    let title=cartItem.getElementsByClassName('item-title')[0].innerText
    let cartItems=JSON.parse(localStorage.getItem('cartItems'))||[]

    for(let i=0;i<cartItems.length;i++){
        if(cartItems[i].title===title){
            cartItems.splice(i,1)
            break
        }
    }
    localStorage.setItem('cartItems',JSON.stringify(cartItems))
}


