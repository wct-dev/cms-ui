<template>
	<div>
		<!--按钮-->
		<el-button type="text" @click="back">返回</el-button>
		<el-button type="danger" size="small" @click="batchDelete">批量删除</el-button>
		<!--/按钮-->
		<!--表格 -->
		<el-table :data="tableData" @selection-change="handleSelectionChange" size="small">
			<el-table-column type="selection" prop="id" label="编号" width="180"> </el-table-column>
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
		
		<!--/表格 -->
	</div>
</template>

<script>
	import request from '@/utils/request'
	import qs from 'querystring'
	export default {
		// 模板中要用到的变量
		data() {
			return {
				tableData: [],
				ids: []
			}
		},
		// 声明周期钩子函数
		created() {
			// 查询所有资讯信息
			request.get("http://localhost:8888/article/cascadeFindAll")
				.then(response => {
					this.tableData = response.data;
				})
		},
		// 方法，模块中要用到的方法，
		methods: {
			handleSelectionChange(val) {
				this.ids = val.map(item => item.id);
			},
			back() {
				this.$router.go(-1);
			},
			reloadData() {
				let url = "http://localhost:8888/article/findAll"
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
			batchDelete() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let url = "http://localhost:8888/article/batchDelete"
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
					let url = "http://localhost:8888/article/deleteById"
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