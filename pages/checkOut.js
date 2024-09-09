export default function (){
    const formActionUrl = `http://localhost:8080/checkout`;
    return (
        <div >
            <h1>Shopping Cart</h1>

            <h3>Node.js and Express book</h3>
            <p>Price: $50.00</p>
            <p>Quantity: 1</p>
            <br/>
            <h3>JavaScript T-Shirt</h3>
            <p>Price: $20.00</p>
            <p>Quantity: 2</p>

            <form action={formActionUrl} method="post">
                <input type="submit" value="Proceed to Checkout"/>
            </form>
        </div>
    )
}