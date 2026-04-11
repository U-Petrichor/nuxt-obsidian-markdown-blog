import { mount } from '@vue/test-utils'
import AppMarkdownReader from '../../app/components/AppMarkdownReader.vue'

describe('AppMarkdownReader', () => {
  it('passes the page payload to ContentRenderer', () => {
    const wrapper = mount(AppMarkdownReader, {
      props: {
        page: {
          title: '示例文档',
        },
      },
      global: {
        stubs: {
          ContentRenderer: {
            props: ['value'],
            template: '<article class="content-renderer">{{ value.title }}</article>',
          },
        },
      },
    })

    expect(wrapper.find('.content-renderer').text()).toBe('示例文档')
  })
})
