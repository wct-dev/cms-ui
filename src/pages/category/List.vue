<template>
	<div>
		<!-- 按钮 -->
		<el-button type="success" size="small" @click="toAdd">新增</el-button>
		<el-button type="danger" size="small" @click="batchDelete">批量删除</el-button>
		<!-- /按钮 -->
		<!-- 表格 -->
		<el-table :data="categories" @selection-change="handleSelectionChange" size="small">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="id" label="栏目编号"></el-table-column>
			<el-table-column prop="name" label="栏目名称"></el-table-column>
			<el-table-column prop="description" label="栏目描述"></el-table-column>
			<el-table-column prop="no" label="栏目序号"></el-table-column>
			<el-table-column prop="parentId" label="父栏目"></el-table-column>
			<el-table-column fixed="right" label="操作" align="center" width="100">
				<template slot-scope="scope">
					<el-button @click="toDelete(scope.row.id)" type="text" size="small">删除</el-button>
					<el-button @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- /表格 -->
		<!-- 模态框 -->
		<el-dialog :title="title" :visible.sync="visible">
			<el-form :model="form">
				<el-form-item label="栏目名称" label-width="80px">
					<el-input v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="栏目介绍" label-width="80px">
					<el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="父栏目" label-width="80px">
					<el-select clearable v-model="form.parentId" placeholder="请选择父栏目">
						<el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="visible = false" size="small">取 消</el-button>
				<el-button type="primary" @click="submitForm" size="small">确 定</el-button>
			</div>
		</el-dialog>
		<!-- /模态框 -->
	</div>
</template>
<script>
	import request from '@/utils/request'
	import qs from 'querystring'
	export default {
		// 数据
		data() {
			return {
				visible: false,
				form: {},
				title: "新增栏目",
				categories: [],
				ids: []
			}
		},
		// 生命周期
		created() {
			this.reloadData();
		},
		// 方法
		methods: {
			handleSelectionChange(val) {
				this.ids = val.map(item => item.id);
			},
			reloadData() {
				let url = "/category/findAll"
				request.get(url).then(response => {
					this.categories = response.data;
				})
			},
			toAdd() {
				this.form = {};
				this.visible = true;
			},
			toEdit(record) {
				// 将要编辑的数据绑定表单中
				this.form = record;
				this.visible = true;
			},
			batchDelete() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let url = "/category/batchDelete"
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
					let url = "/category/deleteById"
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
			},
			submitForm() {
				request.request({
						url: '/category/saveOrUpdate',
						method: 'post',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: qs.stringify(this.form)
					})
					.then(response => {
						// 提示成功
						this.$message({
							message: response.message,
							type: 'success'
						})
						// 关闭模态
						this.visible = false;
						// 重载数据
						this.reloadData();
					})
			}
		}
	}
</script>