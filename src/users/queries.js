const getUsers =  "SELECT * FROM public.users WHERE username = $1";
const checkUniqueName = "SELECT s FROM public.users s WHERE s.username = $1";
const checkUniqueEmail = "SELECT s FROM public.users s WHERE s.email = $1";
const checkUnique = "SELECT * FROM public.users WHERE s.username = $1 OR s.email = $2";
const addUsers = "INSERT INTO public.users (username,password,email) VALUES ($1, $2, $3)";
const loginUser = "SELECT * from public.users WHERE username = $1 ";

module.exports = {
    getUsers,
    addUsers,
    checkUniqueEmail,
    checkUniqueName,
    checkUnique,
    loginUser
}