import { mount } from '@vue/test-utils'
import AppHomeLanding from '../../app/components/AppHomeLanding.vue'

describe('AppHomeLanding', () => {
  it('renders series and standalone article cards', () => {
    const wrapper = mount(AppHomeLanding, {
      props: {
        featuredSeriesArticles: [
          {
            kind: 'series',
            badge: 'Series A',
            title: '系列 A · 总览',
            description: '描述 A',
            to: '/series-a/overview',
            icon: '🧩',
            theme: 'theme-blue',
          },
        ],
        standaloneArticles: [
          {
            kind: 'standalone',
            badge: 'Single',
            title: '关于这个站点',
            description: '描述 B',
            to: '/about',
            icon: '🌿',
            theme: 'theme-emerald',
          },
        ],
      },
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('系列文章')
    expect(wrapper.text()).toContain('独立文章')
    expect(wrapper.findAll('.entry-card')).toHaveLength(2)
  })
})
