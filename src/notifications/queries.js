
const getNotif = "SELECT * FROM public.notifications WHERE user_id = $1";
const markRead = "UPDATE public.notifications SET is_read = $1 WHERE id = $2";

module.exports = {
    getNotif,
    markRead
}