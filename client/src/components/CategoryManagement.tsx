import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Button,
	Input,
	Select,
	Table,
	Modal,
	Form,
	message,
	Popconfirm,
	Space,
	Card,
	Typography,
	Spin,
	Row,
	Col,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { API_BASE_URL } from "@/lib/config";
import { OrderManagementSkeleton } from "./ui/OrderManagement";

const { Title } = Typography;
const { Option } = Select;

interface Category {
	id: number;
	category_name: string;
	parent_category: number | null;
	created_at: string | null;
	updated_at: string | null;
}

interface CategoryWithParentName extends Category {
	parent_category_name: string;
}

interface CategoryFormValues {
	category_name: string;
	parent_category?: number | null;
}

interface ApiResponse<T> {
	data: T;
	message?: string;
}

const CategoryManagement: React.FC = () => {
	const [categories, setCategories] = useState<CategoryWithParentName[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [editingCategory, setEditingCategory] =
		useState<CategoryWithParentName | null>(null);
	const [form] = Form.useForm<CategoryFormValues>();
	const [isAdmin, setIsAdmin] = useState<boolean>(true);
	const [windowWidth, setWindowWidth] = useState<number>(
		typeof window !== "undefined" ? window.innerWidth : 1200
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		if (typeof window !== "undefined") {
			window.addEventListener("resize", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}
	}, []);

	useEffect(() => {
		fetchCategories();
		setIsAdmin(true);
	}, []);

	const fetchCategories = async (): Promise<void> => {
		setLoading(true);
		try {
			const response = await axios.get<Category[]>(
				`${API_BASE_URL}/categories`
			);

			const categoriesWithParentName: CategoryWithParentName[] =
				response.data.map((category) => {
					const parentCategory = response.data.find(
						(c) => c.id === category.parent_category
					);
					return {
						...category,
						parent_category_name: parentCategory
							? parentCategory.category_name
							: "-",
					};
				});
			setCategories(categoriesWithParentName);
		} catch (error) {
			console.error("Failed to fetch categories:", error);
			message.error("Failed to load categories");
		} finally {
			setLoading(false);
		}
	};

	const handleAddCategory = (): void => {
		form.resetFields();
		setEditingCategory(null);
		setModalVisible(true);
	};

	const handleEditCategory = (category: CategoryWithParentName): void => {
		setEditingCategory(category);
		setModalVisible(true);

		setTimeout(() => {
			form.setFieldsValue({
				category_name: category.category_name,
				parent_category: category.parent_category,
			});
		}, 100);
	};

	const handleDeleteCategory = async (id: number): Promise<void> => {
		try {
			await axios.delete<ApiResponse<null>>(
				`${API_BASE_URL}/categories/${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			message.success("Category deleted successfully");
			fetchCategories();
		} catch (error) {
			console.error("Failed to delete category:", error);
			message.error("Failed to delete category");
		}
	};

	const handleModalSubmit = async (): Promise<void> => {
		try {
			const values: CategoryFormValues = await form.validateFields();

			if (editingCategory && values.parent_category === editingCategory.id) {
				message.error("Category cannot be its own parent");
				return;
			}

			const authHeader = {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			};

			if (editingCategory) {
				await axios.put<ApiResponse<Category>>(
					`${API_BASE_URL}/categories/${editingCategory.id}`,
					values,
					authHeader
				);
				message.success("Category updated successfully");
			} else {
				await axios.post<ApiResponse<Category>>(
					`${API_BASE_URL}/categories`,
					values,
					authHeader
				);
				message.success("Category added successfully");
			}

			setModalVisible(false);
			setEditingCategory(null);
			form.resetFields();
			fetchCategories();
		} catch (error: any) {
			console.error("Form submission failed:", error);
			if (error.response?.data?.message) {
				message.error(error.response.data.message);
			} else {
				message.error("Operation failed. Please try again.");
			}
		}
	};

	const handleModalCancel = (): void => {
		setModalVisible(false);
		setEditingCategory(null);
		form.resetFields();
	};

	const columns: TableProps<CategoryWithParentName>["columns"] = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			responsive: ["md"],
		},
		{
			title: "Category Name",
			dataIndex: "category_name",
			key: "category_name",
			sorter: (a: CategoryWithParentName, b: CategoryWithParentName) =>
				a.category_name.localeCompare(b.category_name),
		},
		{
			title: "Parent Category",
			dataIndex: "parent_category_name",
			key: "parent_category_name",
			responsive: ["sm"],
			sorter: (a: CategoryWithParentName, b: CategoryWithParentName) => {
				const parentA = a.parent_category_name || "";
				const parentB = b.parent_category_name || "";
				return parentA.localeCompare(parentB);
			},
		},
		{
			title: "Created At",
			dataIndex: "created_at",
			key: "created_at",
			responsive: ["lg"],
			render: (text: string | null) =>
				text ? new Date(text).toLocaleString() : "-",
			sorter: (a: CategoryWithParentName, b: CategoryWithParentName) => {
				const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
				const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
				return dateA - dateB;
			},
		},
		{
			title: "Updated At",
			dataIndex: "updated_at",
			key: "updated_at",
			responsive: ["xl"],
			render: (text: string | null) =>
				text ? new Date(text).toLocaleString() : "-",
			sorter: (a: CategoryWithParentName, b: CategoryWithParentName) => {
				const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
				const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
				return dateA - dateB;
			},
		},
		{
			title: "Actions",
			key: "actions",
			render: (_: unknown, record: CategoryWithParentName) => (
				<Space size="small" wrap>
					<Button
						size="small"
						icon={<EditOutlined />}
						onClick={() => handleEditCategory(record)}
						disabled={!isAdmin}
					>
						Edit
					</Button>
					<Popconfirm
						title="Are you sure you want to delete this category?"
						onConfirm={() => handleDeleteCategory(record.id)}
						okText="Yes"
						cancelText="No"
						disabled={!isAdmin}
					>
						<Button
							size="small"
							danger
							icon={<DeleteOutlined />}
							disabled={!isAdmin}
						>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	useEffect(() => {
		if (editingCategory && modalVisible) {
			form.setFieldsValue({
				category_name: editingCategory.category_name,
				parent_category: editingCategory.parent_category,
			});
		}
	}, [editingCategory, form, modalVisible]);

	if (loading) {
		return <OrderManagementSkeleton />;
	}

	return (
		<Card className="category-management">
			<Row
				gutter={[16, 16]}
				align="middle"
				justify="space-between"
				className="category-header"
				style={{ marginBottom: 16 }}
			>
				<Col xs={24} sm={16} md={16} lg={18}>
					<Title
						level={2}
						style={{ margin: 0, fontSize: "calc(1.2rem + 0.5vw)" }}
					>
						Category Management
					</Title>
				</Col>
				<Col xs={24} sm={8} md={8} lg={6} style={{ textAlign: "right" }}>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleAddCategory}
						disabled={!isAdmin}
						block={windowWidth < 576}
					>
						Add Category
					</Button>
				</Col>
			</Row>

			<Spin spinning={loading}>
				<div className="table-responsive" style={{ overflowX: "auto" }}>
					<Table<CategoryWithParentName>
						dataSource={categories}
						columns={columns}
						rowKey="id"
						pagination={{
							pageSize: 10,
							responsive: true,
							showSizeChanger: true,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} of ${total} items`,
						}}
						scroll={{ x: "max-content" }}
					/>
				</div>
			</Spin>

			<Modal
				title={
					editingCategory
						? `Edit Category: ${editingCategory.category_name}`
						: "Add Category"
				}
				open={modalVisible}
				onCancel={handleModalCancel}
				onOk={handleModalSubmit}
				destroyOnClose={false}
				width={windowWidth < 576 ? "95%" : 520}
				centered
				maskClosable={false}
				afterClose={() => {
					setEditingCategory(null);
					form.resetFields();
				}}
			>
				<Form
					form={form}
					layout="vertical"
					preserve={false}
					initialValues={{
						category_name: editingCategory?.category_name || "",
						parent_category: editingCategory?.parent_category || null,
					}}
				>
					<Form.Item
						name="category_name"
						label="Category Name"
						rules={[{ required: true, message: "Please enter category name" }]}
					>
						<Input placeholder="Enter category name" />
					</Form.Item>

					<Form.Item name="parent_category" label="Parent Category">
						<Select placeholder="Select parent category (optional)" allowClear>
							{categories.map((category) => (
								<Option
									key={category.id}
									value={category.id}
									disabled={
										editingCategory && editingCategory.id === category.id
									}
								>
									{category.category_name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default CategoryManagement;
