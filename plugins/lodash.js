import Vue from 'vue'
import '~/components/programs/tetris/util/filters.mjs'
import _ from 'lodash'
import { lodashMixin } from '~/components/programs/tetris/util/util.mjs'

_.mixin(lodashMixin)

Vue.use(lodashMixin, { name: '_', _ })