

const imgValidator = async (ctx, next) => {
  try {

    await next()
  } catch (err) {

  }


}


module.exports = {
  uploadFile
}