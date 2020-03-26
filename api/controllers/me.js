module.exports = ({ mongoose }) => {
  const UserModel = mongoose.model('user')
  const DatapointModel = mongoose.model('datapoint')
  return {
    mePostUser: async (req, res, next) => {
      try {
        const body = req.swagger.params.body.value
        const user = await UserModel.create(body)
        res.status(201).json(user.toJSON())
        next()
      } catch (e) {
        next(e)
      }
    },
    meGet: async (req, res, next) => {
      try {
        const token = req.swagger.params['x-auth-token'].value
        const user = await UserModel.findByToken(token)
        res.status(200).json(user.toJSON())
        next()
      } catch (e) {
        next(e)
      }
    },
    meLogin: async (req, res, next) => {
      try {
        const { email, password } = req.swagger.params.body.value
        const user = await UserModel.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.status(200).json({ token, user })
        next()
      } catch (e) {
        next(e)
      }
    },
    mePut: async (req, res, next) => {
      try {
        const token = req.swagger.params['x-auth-token'].value
        const { _id: id } = await UserModel.findByToken(token)
        const body = req.swagger.params.body.value
        const user = await UserModel.update(id, body)
        res.status(201).json(user.toJSON())
        next()
      } catch (e) {
        next(e)
      }
    },
    mePostDatapoint: async (req, res, next) => {
      try {
        const token = req.swagger.params['x-auth-token'].value
        const { _id: user_id } = await UserModel.findByToken(token)
        const body = req.swagger.params.body.value
        const datapoint = await DatapointModel.create({ user_id, ...body })
        res.status(201).json(datapoint.toJSON())
        next()
      } catch (e) {
        next(e)
      }
    },
    meGetDatapoints: async (req, res, next) => {
      try {
        const token = req.swagger.params['x-auth-token'].value
        const { _id: user_id } = await UserModel.findByToken(token)
        const datapoints = await DatapointModel.find({ user_id })
        res.status(201).json(datapoints.map(d => d.toJSON()))
        next()
      } catch (e) {
        next(e)
      }
    },
  }
}
