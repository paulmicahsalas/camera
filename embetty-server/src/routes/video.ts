import { Router } from 'express'
import { facebookRouter } from './video/facebook'
import { vimeoRouter } from './video/vimeo'
import { youtubeRouter } from './video/youtube'

let router: Router = Router()

router.use('/youtube', youtubeRouter)
router.use('/vimeo', vimeoRouter)
router.use('/facebook', facebookRouter)

export let videoRouter = router
