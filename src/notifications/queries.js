// const getItems =  "SELECT * FROM public.items LIMIT $1 OFFSET $2";
// const getUniqueItems = "SELECT * FROM public.items WHERE id = $1";
// const addItem = "INSERT INTO public.items (name,description,starting_price, image_url, end_time, user_id) VALUES ($1, $2, $3, $4, $5, $6)";
// const updateItem = "UPDATE public.items SET name = $1, description = $2, starting_price = $3, image_url = $4, end_time = $5 WHERE id = $6";
// const getUserItems = "SELECT * FROM public.items WHERE user_id = $1";
// const deleteItem = "DELETE FROM public.items WHERE id = $1";
// const getBids = "SELECT * from public.bids WHERE item_id = $1";
// const makeBid = "INSERT INTO public.bids (item_id,user_id,bid_amount) VALUES ($1, $2, $3)";

const getNotif = "SELECT * FROM public.notifications WHERE user_id = $1";
const markRead = "UPDATE public.notifications SET is_read = $1 WHERE user_id = $2";

module.exports = {
    getNotif,
    markRead
}