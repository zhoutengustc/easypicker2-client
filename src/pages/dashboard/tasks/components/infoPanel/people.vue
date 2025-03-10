<template>
  <div class="tc">
    <el-button
      @click="uodateLimitPeople(true)"
      v-if="!people"
      size="default"
      round
      type="success"
      >打开</el-button
    >
    <el-button
      @click="uodateLimitPeople(false)"
      v-if="people"
      size="default"
      round
      type="danger"
      >关闭</el-button
    >
    <el-button
      @click="checkPeople"
      v-if="people"
      round
      size="default"
      type="primary"
      >查看提交情况</el-button
    >
    <div
      class="upload-people"
      v-if="people"
    >
      <el-upload
        accetp="text/plain"
        action
        class="upload-demo"
        ref="peopleUpload"
        :on-change="handleChangeFile"
        :on-exceed="handleExceedFile"
        :on-remove="clearFiles"
        :auto-upload="false"
        :limit="1"
        :file-list="peopleFileList"
      >
        <template #trigger>
          <el-button
            size="small"
            type="primary"
            >选取文件</el-button
          >
        </template>
        <el-button
          @click="submitUploadPeople"
          style="margin-left: 10px"
          size="small"
          type="success"
          >开始上传</el-button
        >
        <template #tip>
          <div class="el-upload__tip">
            只能上传 txt
            文本文件,每行一个名字
          </div>
        </template>
      </el-upload>
    </div>
    <el-dialog
      :fullscreen="isMobile"
      title="提交情况"
      v-model="showPeopList"
    >
    <!-- 上部分的筛选菜单 -->
      <div class="nav">
        <div class="item">
          <el-button
            :disabled="
              peopleList.length === 0
            "
            type="success"
            size="default"
            @click="handleExportExcel"
            >导出记录</el-button
          >
        </div>
        <div class="item">
          <el-select
            size="default"
            v-model="selectSubmitStatus"
            filterable
            placeholder="状态筛选"
          >
            <el-option
              label="全部"
              value="all"
            />
            <el-option
              label="已提交"
              value="1"
            />
            <el-option
              label="未提交"
              value="0"
            />
          </el-select>
        </div>
        <div class="item">
          <el-input
            size="default"
          placeholder="输入要查询的姓名" v-model="searchName"></el-input>
        </div>
      </div>
      <!-- 数据部分 -->
      <el-table
        stripe
        border
        :data="peopleSubmitData"
        height="460px"
      >
        <el-table-column
          sortable
          property="name"
          label="姓名"
          width="100"
        ></el-table-column>
        <el-table-column
          label="提交状态"
          width="100"
        >
          <template #default="scope">
            <span
              class="submit-ok"
              v-if="scope.row.status"
              >已提交</span
            >
            <span
              class="submit-fail"
              v-else
              >未提交</span
            >
          </template>
        </el-table-column>
        <el-table-column
          sortable
          property="lastDate"
          label="最后提交时间"
          width="180"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
          <template #default="scope">
            <el-button
              @click="
                handleDeletePeople(
                  scope.row
                )
              "
              type="text"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watchEffect,
} from 'vue'
import { useStore } from 'vuex'
import { PeopleApi } from '@/apis'
import {
  uploadFile,
  tableToExcel,
} from '@/utils/networkUtil'
import { formatDate } from '@/utils/stringUtil'
import { updateTaskInfo } from '../../public'

export default defineComponent({
  props: {
    value: {
      type: Number,
      defalut: 0,
    },
    k: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  name: 'peoplePanel',
  setup(props) {
    const people = ref(0)
    watchEffect(() => {
      people.value = props.value as number
    })
    // 限制提交人员
    const uodateLimitPeople = (
      limit: boolean,
    ) => {
      updateTaskInfo(props.k, {
        people: +limit,
      })
      people.value = +limit
    }
    // 查看提交情况
    const showPeopList = ref(false)
    const peopleList: any = reactive(
      [],
    )
    const selectSubmitStatus = ref('all')
    const searchName = ref('')
    const filterPeopleBySearchWord = computed(() => {
      if (!searchName.value) {
        return peopleList
      }
      return peopleList.filter((v) => v.name.includes(searchName.value))
    })
    const peopleSubmitData = computed(() => {
      if (selectSubmitStatus.value === 'all') {
        return filterPeopleBySearchWord.value
      }
      return filterPeopleBySearchWord.value.filter((p) => p.status === +selectSubmitStatus.value)
    })
    const checkPeople = () => {
      PeopleApi.getPeople(props.k).then(
        (res) => {
          peopleList.splice(
            0,
            peopleList.length,
          )
          peopleList.push(
            ...res.data.people,
          )
          peopleList.forEach((p) => {
            if (!p.status) {
              p.lastDate = '暂无记录'
            } else {
              p.lastDate = formatDate(
                new Date(p.lastDate),
                'yyyy-MM-dd hh:mm:ss',
              )
            }
          })
          showPeopList.value = true
        },
      )
    }
    const handleDeletePeople = (
      item: any,
    ) => {
      ElMessageBox.confirm(
        '确认删除此人员吗',
        '提示',
      )
        .then(() => {
          PeopleApi.deletePeople(
            props.k,
            item.id,
          ).then(() => {
            ElMessage.success(
              '删除成功',
            )
            peopleList.splice(
              peopleList.findIndex(
                (v) => v.id === item.id,
              ),
              1,
            )
          })
        })
        .catch(() => {
          ElMessage.info('取消删除')
        })
    }

    // 文件上传
    const peopleFileList: any[] = reactive([])
    const peopleUpload = ref()
    // 超出选择的文件个数
    const handleExceedFile = () => {
      ElMessage.error(
        '只能选择一个文件,可删除后重新选择',
      )
    }
    // 清空文件
    const clearFiles = () => {
      peopleFileList.splice(
        0,
        peopleFileList.length,
      )
      peopleUpload.value.clearFiles()
    }
    // 开始上传
    const submitUploadPeople = () => {
      peopleFileList.forEach((file) => {
        uploadFile(
          file.raw,
          '/api/public/upload',
          {
            success: (e: any) => {
              const { name, type } = e.data
              PeopleApi.importPeople(
                props.k,
                name,
                type,
              ).then((res) => {
                const {
                  success,
                  fail,
                } = res.data
                ElMessage.success(
                  `导入完成:${success}成功,${fail.length}失败`,
                )
                if (fail.length > 0) {
                  setTimeout(() => {
                    ElMessage.info(
                      '自动开始下载未成功导入名单',
                    )
                    tableToExcel(
                      [
                        '未成功导入名单',
                      ],
                      fail.map(
                        (v: string) => [
                          v,
                        ],
                      ),
                      `${
                        props.name
                      }_导入失败名单_${formatDate(
                        new Date(),
                        'yyyy年MM月日hh时mm分ss秒',
                      )}.xls`,
                    )
                  }, 1000)
                }
                clearFiles()
              })
            },
          },
        )
      })
    }

    // 添加文件
    const handleChangeFile = (
      file: any,
    ) => {
      if (
        file.raw.type !== 'text/plain'
      ) {
        ElMessage.warning({
          message: '只支持txt文件',
          zIndex: 4000,
        })
        clearFiles()
        return
      }
      peopleFileList.push(file)
    }
    const handleExportExcel = () => {
      if (peopleSubmitData.value.length === 0) {
        ElMessage.warning(
          '表格中没有可导出数据',
        )
        return
      }
      const headers = [
        '姓名',
        '提交状态',
        '最后提交时间',
      ]
      const body = peopleSubmitData.value.map(
        (v) => {
          const {
            name,
            status,
            lastDate,
          } = v
          return [
            name,
            status ? '✔' : 'x',
            status
              ? formatDate(
                new Date(lastDate),
              )
              : '',
          ]
        },
      )
      tableToExcel(
        headers,
        body,
        `${
          props.name
        }_提交情况_${formatDate(
          new Date(),
          'yyyy年MM月日hh时mm分ss秒',
        )}.xls`,
      )
      ElMessage.success('导出成功')
    }

    const $store = useStore()
    const isMobile = computed(
      () => $store.getters[
        'public/isMobile'
      ],
    )

    return {
      isMobile,
      handleExportExcel,
      people,
      uodateLimitPeople,
      checkPeople,
      handleExceedFile,
      handleChangeFile,
      submitUploadPeople,
      clearFiles,
      peopleFileList,
      peopleUpload,
      showPeopList,
      peopleList,
      handleDeletePeople,
      formatDate,
      selectSubmitStatus,
      peopleSubmitData,
      searchName,
    }
  },
})
</script>
<style scoped>
.upload-people {
  padding: 10px;
}
.submit-ok {
  color: #67c23a;
}
.submit-fail {
  color: #f56c6c;
}
.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 5px;
}
.nav .item {
  margin-left: 10px;
  margin-top: 5px;
}
</style>
