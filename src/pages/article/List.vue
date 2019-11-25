<template>
	<div>
		<el-button type="success" size="small" @click="toPublishArticle">发布文章</el-button>
		<el-button type="primary" size="small" @click="batchManager">批量管理</el-button>
		<el-table :data="tableData" style="width: 100%" size="small">
			<el-table-column prop="id" label="编号" width="180"> </el-table-column>
			<el-table-column prop="title" label="标题" width="180"> </el-table-column>
			<el-table-column prop="authorId" label="作者"> </el-table-column>
			<el-table-column prop="category.name" label="所属栏目"> </el-table-column>
			<el-table-column fixed="right" label="操作" alige="center" width="200">
				<template slot-scope="scope">
					<el-button @click="toDelete(scope.row.id)" type="text" size="small">删除</el-button>
					<el-button type="text" size="small">查看</el-button>
					<el-button @click="toEditArticle(scope.row)" type="text" size="small">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import request from '@/utils/request'
	export default {
		// 模板中要用到的变量
		data() {
			return {
				tableData: []
			}
		},
		// 声明周期钩子函数
		created() {
			// 查询所有资讯信息
			request.get("/article/cascadeFindAll")
				.then(response => {
					this.tableData = response.data;
				})
		},
		// 方法，模块中要用到的方法，
		methods: {
			reloadData() {
				let url = "/article/findAll"
				request.get(url).then(response => {
					this.tableData = response.data;
				})
			},
			toPublishArticle() {
				// 跳转页面
				this.$router.push({
					path: '/article/Editor'
				})
			},
			toEditArticle(row) {
				this.$router.push({
					path: '/article/Editor',
					query: row
				})
			},
			batchManager(){
				// 跳转页面
				this.$router.push({
					path: '/article/Manager'
				})
			},
			batchDelete() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let url = "/article/batchDelete"
						request.request({
								url,
								method: "post",
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								data: qs.stringify({
									ids: this.ids
								})
							})
							.then(response => {
								this.$message({
									type: 'success',
									message: response.message
								});
								// 重载数据
								this.reloadData();
							})
					})
			},
			toDelete(id) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let url = "/article/deleteById"
					request.get(url, {
							params: {
								id
							}
						})
						.then(response => {
							this.$message({
								type: 'success',
								message: response.message
							});
							// 重载数据
							this.reloadData();
						})
				})
			}
		}
	}
</script>

<style scoped>

</style>